import { db } from "@/db";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { pinecone } from '@/lib/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

export const POST = async (req: NextRequest) => {

    // question answering end point
    const body = await req.json()

    const { getUser } = getKindeServerSession()
    const user = getUser()

    const { id: userId } = user

    if (!userId)
        return new Response('Unauthorized', { status: 401 })

    const { fileId, message } = sendMessageValidator.parse(body)

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    })

    if (!file) return new Response('Not Found', { status: 404 })

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId, 
        }
    })

    // 1: vectorize message
const pineconeIndex = pinecone.Index('quill');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
});
}