import { useMemo } from 'react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import type { OrderDetails } from '@/components/app/order-receipt';

/**
 * Extracts order details from chat messages when order is complete.
 * Looks for the agent's confirmation message that contains order details.
 */
export function useOrderDetails(messages: ReceivedChatMessage[]): OrderDetails | null {
  return useMemo(() => {
    // Look for the agent's order completion message
    // The agent says: "Perfect! I've saved your order: {size} {drinkType} with {milk}, {extras}. Thanks {name}, your order will be ready soon!"
    const completionMessage = messages
      .filter((msg) => !msg.from?.isLocal)
      .find((msg) => 
        msg.message.toLowerCase().includes("saved your order") ||
        msg.message.toLowerCase().includes("order will be ready") ||
        msg.message.toLowerCase().includes("perfect! i've saved")
      );

    if (!completionMessage) {
      return null;
    }

    // Parse the order details from the message
    // The agent says: "Perfect! I've saved your order: {size} {drinkType} with {milk}, {extras}. Thanks {name}, your order will be ready soon!"
    const message = completionMessage.message;
    
    // Extract order details using regex patterns
    // Pattern: "{size} {drinkType} with {milk}, {extras}"
    const orderPattern = message.match(/(?:saved your order|order):\s*([^\.]+?)(?:\.|Thanks|,)/i);
    
    if (!orderPattern) {
      return null;
    }
    
    const orderText = orderPattern[1].trim();
    
    // Extract size
    const sizeMatch = orderText.match(/\b(small|medium|large|tall|grande|venti)\b/i);
    if (!sizeMatch) return null;
    const size = sizeMatch[1].toLowerCase();
    
    // Extract drink type
    const drinkMatch = orderText.match(/\b(latte|cappuccino|americano|espresso|mocha|macchiato|frappuccino|flat white|cold brew|iced coffee|coffee)\b/i);
    if (!drinkMatch) return null;
    const drinkType = drinkMatch[1].toLowerCase();
    
    // Extract milk (look for "with {milk}")
    const milkMatch = orderText.match(/with\s+([^,\.]+?)(?:\s*,|\s*\.|$)/i);
    if (!milkMatch) return null;
    const milk = milkMatch[1].trim().toLowerCase();
    
    // Extract extras from the order text
    let extras: string[] = [];
    const extrasInOrder = orderText.match(/(?:extras?|additions?):\s*([^\.]+)/i);
    if (extrasInOrder) {
      extras = extrasInOrder[1]
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
    } else {
      // Look for common extras mentioned in the text
      const commonExtras = ['vanilla syrup', 'caramel', 'chocolate', 'whipped cream', 'cinnamon', 'hazelnut', 'maple syrup', 'honey', 'sugar'];
      commonExtras.forEach(extra => {
        if (orderText.toLowerCase().includes(extra)) {
          extras.push(extra);
        }
      });
    }
    
    // Extract name (look for "Thanks {name}" or "for {name}")
    const nameMatch = message.match(/(?:thanks|thank you)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ||
                     message.match(/for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (!nameMatch) return null;
    const name = nameMatch[1].trim();

    // Also check previous messages for extras mentioned separately
    messages
      .filter((msg) => !msg.from?.isLocal)
      .forEach((msg) => {
        const msgText = msg.message.toLowerCase();
        if (msgText.includes('added') && (msgText.includes('syrup') || msgText.includes('cream') || msgText.includes('extra'))) {
          // Extract what was added - look for "Added {extra} to your order"
          const addedMatch = msgText.match(/(?:added|add)\s+([^\.]+?)(?:\s+to|\s*\.|$)/i);
          if (addedMatch) {
            const added = addedMatch[1].trim();
            if (added && !extras.includes(added)) {
              extras.push(added);
            }
          }
        }
      });

    return {
      drinkType,
      size,
      milk,
      extras,
      name,
    };
  }, [messages]);
}

