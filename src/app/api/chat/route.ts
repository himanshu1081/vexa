import OpenAI from "openai";
import { Groq } from 'groq-sdk';

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    const { messages } = await req.json();


    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages,
        temperature: 0.7,
        max_tokens: 850,
    });
    console.log(completion.choices[0].message.content)


    // const response = await client.responses.create({
    //     model: "gpt-5-nano",
    //     input: prompt,
    // });

    return Response.json({
        text: completion.choices[0].message.content
    });
}
