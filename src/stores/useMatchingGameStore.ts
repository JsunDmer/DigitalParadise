import { create } from 'zustand';

export interface Card {
  id: number;
  number: number;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

interface MatchingGameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  totalPairs: number;
  completedRounds: number;
  level: number;
  moves: number;
  isLocked: boolean;
  isCompleted: boolean;
  lastMatchedNumber: number | null;
}

interface MatchingGameActions {
  initializeGame: () => void;
  flipCard: (cardId: number) => void;
  checkMatch: () => void;
  resetGame: () => void;
}

type MatchingGameStore = MatchingGameState & MatchingGameActions;

const getPairsByLevel = (level: number): number => {
  if (level <= 2) return 6;
  if (level <= 4) return 8;
  return 10;
};

const generateCards = (pairCount: number): Card[] => {
  const numbers = Array.from({ length: pairCount }, (_, index) => index + 1);
  const cardPairs = [...numbers, ...numbers];
  
  for (let i = cardPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
  }
  
  return cardPairs.map((number, index) => ({
    id: index,
    number,
    isFlipped: false,
    isMatched: false,
    isShaking: false,
  }));
};

const initialState: MatchingGameState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 6,
  completedRounds: 0,
  level: 1,
  moves: 0,
  isLocked: false,
  isCompleted: false,
  lastMatchedNumber: null,
};

export const useMatchingGameStore = create<MatchingGameStore>((set, get) => ({
  ...initialState,

  initializeGame: () => {
    set((state) => {
      const targetPairs = getPairsByLevel(state.level);
      return {
      cards: generateCards(targetPairs),
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: targetPairs,
      moves: 0,
      isLocked: false,
      isCompleted: false,
      lastMatchedNumber: null,
      completedRounds: state.completedRounds,
      level: state.level,
    };
    });
  },

  flipCard: (cardId: number) => {
    const { cards, flippedCards, isLocked, isCompleted } = get();
    
    if (isLocked || isCompleted) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (flippedCards.length >= 2) return;
    
    const updatedCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    const newFlippedCards = [...flippedCards, cardId];
    
    set({
      cards: updatedCards,
      flippedCards: newFlippedCards,
    });
    
    if (newFlippedCards.length === 2) {
      set({ isLocked: true });
      setTimeout(() => {
        get().checkMatch();
      }, 800);
    }
  },

  checkMatch: () => {
    const { cards, flippedCards, matchedPairs, moves } = get();
    
    if (flippedCards.length !== 2) return;
    
    const [firstCardId, secondCardId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstCardId)!;
    const secondCard = cards.find(c => c.id === secondCardId)!;
    
    const isMatch = firstCard.number === secondCard.number;
    
    if (isMatch) {
      const updatedCards = cards.map(c =>
        c.id === firstCardId || c.id === secondCardId
          ? { ...c, isMatched: true }
          : c
      );
      
      const newMatchedPairs = matchedPairs + 1;
      const isCompleted = newMatchedPairs === get().totalPairs;
      
      set({
        cards: updatedCards,
        flippedCards: [],
        matchedPairs: newMatchedPairs,
        moves: moves + 1,
        isLocked: false,
        isCompleted,
        lastMatchedNumber: firstCard.number,
      });
    } else {
      const shakeCards = cards.map(c =>
        c.id === firstCardId || c.id === secondCardId
          ? { ...c, isShaking: true }
          : c
      );
      
      set({ cards: shakeCards });
      
      setTimeout(() => {
        const resetCards = cards.map(c =>
          c.id === firstCardId || c.id === secondCardId
            ? { ...c, isFlipped: false, isShaking: false }
            : c
        );
        
        set({
          cards: resetCards,
          flippedCards: [],
          moves: moves + 1,
          isLocked: false,
        });
      }, 600);
    }
  },

  resetGame: () => {
    set((state) => {
      const newCompletedRounds = state.completedRounds + 1;
      const newLevel = Math.floor(newCompletedRounds / 5) + 1;
      const targetPairs = getPairsByLevel(newLevel);
      return {
        cards: generateCards(targetPairs),
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: targetPairs,
        completedRounds: newCompletedRounds,
        level: newLevel,
        moves: 0,
        isLocked: false,
        isCompleted: false,
        lastMatchedNumber: null,
      };
    });
  },
}));
