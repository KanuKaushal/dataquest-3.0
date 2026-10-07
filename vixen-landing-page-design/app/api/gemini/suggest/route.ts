import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { machines, parts, technicians, type Skill } from '@/lib/mock-data'

interface RequestPayload {
  machineId?: string | null
  title?: string
  description?: string
  category?: string | null
  skills?: Skill[]
  priority?: string | null
}

export async function POST(req: Request) {
  try {
    const body: RequestPayload = await req.json()
    const { machineId, title = '', description = '', category, skills = [], priority } = body

    const selectedMachine = machines.find((m) => m.id === machineId)

    // Context strings for Gemini
    const technicianContext = technicians
      .map(
        (t) =>
          `- ${t.name}: Base=${t.site}, Available=${t.available ? 'YES' : 'NO (Busy)'}, Skills=[${t.skills.join(', ')}]`,
      )
      .join('\n')

    const machineContext = machines
      .map(
        (m) =>
          `- ${m.id} (${m.type}): Site=${m.site}, Status=${m.openRequestId ? 'Has open request' : 'Operational'}, Warranty=${m.underWarranty ? 'Yes' : 'No'}`,
      )
      .join('\n')

    const partsContext = parts
      .map((p) => `- ${p.name} (ID: ${p.id}): Stock=${p.stock}`)
      .join('\n')

    const prompt = `You are ServiceSync AI, an expert industrial maintenance dispatch and diagnostic engine powered by Gemini.
Analyze the following maintenance service request and suggest the best technician match and site location.

Request Details:
- Machine: ${selectedMachine ? `${selectedMachine.id} (${selectedMachine.type}) at ${selectedMachine.site}` : machineId || 'Not specified yet'}
- Title: ${title || 'Unspecified'}
- Description: ${description || 'No description provided'}
- Fault Category: ${category || 'Unspecified'}
- Required Skills: ${skills.length > 0 ? skills.join(', ') : 'Not selected yet'}
- Priority: ${priority || 'medium'}

Available Technicians:
${technicianContext}

Equipment Registry & Sites:
${machineContext}

Spare Parts Inventory:
${partsContext}

Provide recommendations in valid, clean JSON with this exact schema:
{
  "recommendedTechnician": {
    "name": string (exact name of the best matching technician from the list),
    "matchScore": number (integer between 70 and 99),
    "site": string (the technician's site),
    "reason": string (short 1-2 sentence explanation of why they are the best fit considering their skills, location, and availability),
    "available": boolean
  },
  "recommendedSite": {
    "site": string (e.g. "Site A", "Site B", or "Site C"),
    "reason": string (short 1-2 sentence explanation of why this site is recommended)
  },
  "diagnosis": string (a concise 1-2 sentence diagnostic assessment of what is likely causing the fault),
  "recommendedSkills": string[] (subset from: Mechanical, Electrical, Hydraulic, HVAC, Welding, PLC/Controls),
  "recommendedParts": string[] (relevant part names from the inventory or recommended parts),
  "urgencyAdvice": string (short operational advice on SLA and safety)
}

Respond ONLY with valid JSON. Do not wrap in markdown backticks.`

    const apiKey = process.env.GEMINI_API_KEY || ''
    
    if (apiKey) {
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      for (const model of modelsToTry) {
        try {
          const client = new GoogleGenAI({ apiKey })
          const response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          })

          const rawText = response.text || ''
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim()
          const parsed = JSON.parse(cleaned)

          return NextResponse.json({
            source: model,
            ...parsed,
          })
        } catch (geminiError: any) {
          console.warn(`Gemini API call on ${model} failed, trying next option:`, geminiError?.message || geminiError)
        }
      }
    }

    // Heuristic Fallback Engine
    const targetSite = selectedMachine?.site || 'Site A'
    const availableTechs = technicians.filter((t) => t.available)
    const sameSiteTechs = availableTechs.filter((t) => t.site === targetSite)
    
    // Pick best technician
    let bestTech = sameSiteTechs.find((t) => 
      skills.some((s) => t.skills.includes(s))
    ) || sameSiteTechs[0] || availableTechs[0] || technicians[0]

    const fallbackSkills: Skill[] = skills.length > 0 
      ? skills 
      : category === 'Electrical' ? ['Electrical', 'PLC/Controls']
      : category === 'Hydraulic' ? ['Hydraulic', 'Mechanical']
      : ['Mechanical']

    const fallbackResponse = {
      source: 'heuristic-fallback',
      recommendedTechnician: {
        name: bestTech.name,
        matchScore: bestTech.available ? 94 : 78,
        site: bestTech.site,
        reason: `${bestTech.name} is stationed at ${bestTech.site} with core competencies in ${bestTech.skills.join(' & ')}.`,
        available: bestTech.available,
      },
      recommendedSite: {
        site: targetSite,
        reason: selectedMachine 
          ? `Equipment ${selectedMachine.id} is physically installed at ${targetSite}.`
          : `Fastest dispatch location with active technician coverage.`,
      },
      diagnosis: `Identified potential ${category || 'mechanical'} anomaly based on initial symptoms. Early isolation recommended.`,
      recommendedSkills: fallbackSkills,
      recommendedParts: ['Bearing 6205', 'Seal kit SK-14'],
      urgencyAdvice: 'Dispatch assigned technician within SLA window to prevent cascading component wear.',
    }

    return NextResponse.json(fallbackResponse)
  } catch (error) {
    console.error('Error in suggest route:', error)
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    )
  }
}
