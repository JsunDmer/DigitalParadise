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
  moves: number;
  isLocked: boolean;
  isCompleted: boolean;
}

interface MatchingGameActions {
  initializeGame: () => void;
  flipCard: (cardId: number) => void;
  checkMatch: () => void;
  resetGame: () => void;
}

type MatchingGameStore = MatchingGameState & MatchingGameActions;

const generateCards = (): Card[] => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
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
  totalPairs: 8,
  moves: 0,
  isLocked: false,
  isCompleted: false,
};

export const useMatchingGameStore = create<MatchingGameStore>((set, get) => ({
  ...initialState,

  initializeGame: () => {
    set({
      cards: generateCards(),
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isLocked: false,
      isCompleted: false,
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
    set({
      ...initialState,
      cards: generateCards(),
    });
  },
}));
