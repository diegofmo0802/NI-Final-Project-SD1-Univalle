export class Language {
    private static readonly FOLDER: string = '/client/language/';
    private static messages: Map<string, string> = new Map();
    /**
     * Loads the language file.
     * @param language - The language to load.
     */
    public static async load(language: string): Promise<void> {
        const response = await fetch(Language.FOLDER + language.toLowerCase() + '.json');
        if (!response.ok) console.warn('language not found:', language);
        else {
            const data = await response.json();
            Language.messages = new Map(Object.entries(data));
        }
    }
    /**
     * Gets a message from the language file.
     * @param key - The key of the message.
     * @param defaultValue - The default value if the message is not found.
     */
    public static get(key: string, defaultValue?: string): string {
        return Language.messages.get(key) || defaultValue || key;
    }
}
export default Language