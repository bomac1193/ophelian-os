/**
 * Enhanced Gateway Hints
 * Rich, evocative Layer 2 content for each Orisha
 *
 * Structure:
 * - Short hint (shown on hover)
 * - Expanded content (shown on click)
 * - Correspondences (sacred details)
 */

import type { OrishaName } from '../types/genome.types.js';

export interface EnhancedGatewayHint {
  shortHint: string;
  expandedContent: string;
  correspondences: {
    element?: string;
    day?: string;
    number?: number;
    colors?: string[];
  };
  actionableInsight: string;
}

export const ENHANCED_GATEWAY_HINTS: Record<OrishaName, EnhancedGatewayHint> = {
  'Ògún': {
    shortHint: 'The forge burns eternal, shaping chaos into order',
    expandedContent: 'Ògún transforms raw potential into manifest reality through disciplined craft and unwavering will. This character cuts through obstacles with the precision of iron, building structures that endure. Where others see barriers, they see material waiting to be shaped.',
    correspondences: {
      element: 'Iron',
      day: 'Tuesday',
      number: 7,
      colors: ['Green', 'Black'],
    },
    actionableInsight: 'Channel energy into building something tangible. Obstacles are raw material for your forge.',
  },

  'Ọ̀ṣun': {
    shortHint: 'Beauty flows like golden water, irresistible and sweet',
    expandedContent: 'Ọ̀ṣun wields desire and beauty as creative forces, drawing what is needed through magnetic attraction rather than force. This character understands that the softest water wears away the hardest stone, and that true power often wears silk instead of armor.',
    correspondences: {
      element: 'River',
      day: 'Saturday',
      number: 5,
      colors: ['Gold', 'Amber', 'Coral'],
    },
    actionableInsight: 'Lead with charm and authentic desire. What you love flows toward you naturally.',
  },

  'Èṣù': {
    shortHint: 'At every crossroads, possibility splits infinity',
    expandedContent: 'Èṣù dwells in the liminal spaces between order and chaos, opening and closing doors with trickster wisdom. This character thrives in transitions and transformations, understanding that every ending births a beginning. They are the messenger, the translator, the one who makes exchange possible.',
    correspondences: {
      element: 'Crossroads',
      day: 'Monday',
      number: 3,
      colors: ['Red', 'Black'],
    },
    actionableInsight: 'Embrace change as opportunity. The threshold is where magic happens.',
  },

  'Ṣàngó': {
    shortHint: 'Thunder speaks with absolute authority and justice',
    expandedContent: 'Ṣàngó commands through presence and delivers swift judgment when balance is violated. This character embodies righteous power—not the tyranny of force, but the natural authority of one who stands unwavering in truth. Their word is law, their judgment final.',
    correspondences: {
      element: 'Thunder',
      day: 'Friday',
      number: 6,
      colors: ['Red', 'White'],
    },
    actionableInsight: 'Stand in your authority. Justice delayed is justice denied.',
  },

  'Yemọja': {
    shortHint: 'The ocean holds all things in her infinite depths',
    expandedContent: 'Yemọja is the primordial mother, containing multitudes within her vast embrace. This character creates space for all things to gestate and emerge in their own time. Like the ocean, they are simultaneously nurturing and unfathomable, gentle waves hiding tremendous depths.',
    correspondences: {
      element: 'Ocean',
      day: 'Saturday',
      number: 7,
      colors: ['Blue', 'White', 'Crystal'],
    },
    actionableInsight: 'Hold space without forcing growth. Everything emerges in its season.',
  },

  'Ọ̀rúnmìlà': {
    shortHint: 'Infinite wisdom sees all paths simultaneously',
    expandedContent: 'Ọ̀rúnmìlà perceives the branching futures, the weight of choices, the threads of destiny weaving through apparent chaos. This character is the grand diviner, reading patterns others cannot see, offering guidance without removing the burden of choice.',
    correspondences: {
      element: 'Wisdom',
      day: 'Every day',
      number: 16,
      colors: ['Green', 'Yellow'],
    },
    actionableInsight: 'Seek patterns in the chaos. Wisdom lies in seeing connections.',
  },

  'Obàtálá': {
    shortHint: 'From pure void, all forms are born in perfection',
    expandedContent: 'Obàtálá is the sculptor of humanity, the artist who shapes being from void. This character embodies creation through clarity and purity of intent. They understand that true power comes not from force but from perfect alignment with cosmic principle.',
    correspondences: {
      element: 'Clouds',
      day: 'Sunday',
      number: 8,
      colors: ['White', 'Silver'],
    },
    actionableInsight: 'Clarity precedes creation. Begin from emptiness, shape with intention.',
  },

  'Ọ̀ṣọ́ọ̀sì': {
    shortHint: 'The arrow finds its mark through perfect focus',
    expandedContent: 'Ọ̀ṣọ́ọ̀sì moves through complexity with singular focus, tracking truth through wilderness with hunter\'s precision. This character understands that mastery comes from unwavering attention, that the clearest path forward often requires patient stalking through tangled undergrowth.',
    correspondences: {
      element: 'Forest',
      day: 'Thursday',
      number: 7,
      colors: ['Blue', 'Red'],
    },
    actionableInsight: 'Focus eliminates distraction. Track your truth with hunter\'s patience.',
  },

  'Ọ̀sanyìn': {
    shortHint: 'Every herb knows the secret of restoration',
    expandedContent: 'Ọ̀sanyìn holds the knowledge of natural cycles, the medicine hidden in leaf and root. This character heals through understanding balance, knowing when to add and when to remove, when to stimulate and when to rest. They read the body\'s wisdom like others read books.',
    correspondences: {
      element: 'Herbs',
      day: 'Monday',
      number: 1,
      colors: ['Green', 'Red', 'Black', 'White'],
    },
    actionableInsight: 'Balance restores health. Listen to the body\'s natural rhythms.',
  },

  'Ọya': {
    shortHint: 'The storm sweeps away what no longer serves',
    expandedContent: 'Ọya is the wind that precedes change, the force that clears space for new growth by ruthlessly removing what has died. This character is the guardian of transitions, particularly the greatest transition of all. They understand that death is not ending but transformation.',
    correspondences: {
      element: 'Wind',
      day: 'Wednesday',
      number: 9,
      colors: ['Maroon', 'Purple', 'Orange'],
    },
    actionableInsight: 'Release what\'s dead to make space for new life. Transformation requires loss.',
  },
};

/**
 * Get enhanced hint for an Orisha
 */
export function getEnhancedHint(orisha: OrishaName): EnhancedGatewayHint {
  return ENHANCED_GATEWAY_HINTS[orisha];
}
