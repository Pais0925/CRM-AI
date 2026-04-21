const prisma = require('../lib/prisma');

/**
 * Hermes AI Agent Wrapper
 * This acts as the interface to the Hermes LLM.
 * Accepts a contact ID and the user's incoming message content.
 */
async function processMessage(contactId, userMessageContent) {
  try {
    console.log(`[Hermes Agent] Simulating processing for contact ${contactId}. Prompt: "${userMessageContent}"`);
    
    // Simulate AI Latency & Inference computation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated Intelligence Logic
    let aiResponse = "I am Hermes AI. I've received your request and am parsing our Knowledge Base.";
    if (userMessageContent.toLowerCase().includes("pricing")) {
      aiResponse = "Our basic tier starts at $99/mo. Would you like a demo?";
    } else if (userMessageContent.toLowerCase().includes("human")) {
      aiResponse = "I will connect you to a human agent shortly. Please hold on.";
    }

    // Save the agent's response autonomous action to Prisma
    const savedMessage = await prisma.message.create({
      data: {
        contactId: contactId,
        role: "agent",
        content: aiResponse,
        // Mark as HITL flag if the user explicitly requested a human
        isError: userMessageContent.toLowerCase().includes("human")
      }
    });

    console.log(`[Hermes Agent] Replied: "${aiResponse}"`);
    return savedMessage;

  } catch (error) {
    console.error(`[Hermes Agent] Inference Error:`, error);
    throw error;
  }
}

module.exports = {
  processMessage
};
