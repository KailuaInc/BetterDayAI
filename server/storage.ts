// BetterDay uses stateless AI interactions, no storage needed
export interface IStorage {}

export class MemStorage implements IStorage {}

export const storage = new MemStorage();
