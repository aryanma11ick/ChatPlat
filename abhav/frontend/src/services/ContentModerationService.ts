// ContentModerationService.ts - Handles content moderation

// List of inappropriate words to filter
const INAPPROPRIATE_WORDS = [
  "badword",
  "offensive",
  "inappropriate",
  "vulgar",
  "profanity",
  "obscene",
  "damn",
  "hell",
  "ass",
  "crap",
  "shit",
  "fuck",
  "bitch",
  "bastard",
  "dick",
  "piss",
  // Add more words as needed
]

class ContentModerationService {
  // Check if content contains inappropriate words
  checkContent(content: string): { isAppropriate: boolean; flaggedWords: string[] } {
    const lowerContent = content.toLowerCase()
    const flaggedWords: string[] = []

    for (const word of INAPPROPRIATE_WORDS) {
      // Check if the content contains the inappropriate word as a whole word
      const regex = new RegExp(`\\b${word}\\b`, "i")
      if (regex.test(lowerContent)) {
        flaggedWords.push(word)
      }
    }

    return {
      isAppropriate: flaggedWords.length === 0,
      flaggedWords,
    }
  }

  // Highlight inappropriate words in content
  highlightInappropriateWords(content: string): string {
    let highlightedContent = content

    for (const word of INAPPROPRIATE_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="bg-red-200 dark:bg-red-900 px-1 rounded">$&</span>`,
      )
    }

    return highlightedContent
  }

  // Censor inappropriate words in content
  censorContent(content: string): string {
    let censoredContent = content

    for (const word of INAPPROPRIATE_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      censoredContent = censoredContent.replace(regex, "*".repeat(word.length))
    }

    return censoredContent
  }
}

// Create a singleton instance
const contentModerationService = new ContentModerationService()
export default contentModerationService
