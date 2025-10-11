import api from './api';
import { Skill } from '../types';

const SkillService = {
  // Get all skills
  getAllSkills: async (): Promise<Skill[]> => {
    const response = await api.get<Skill[]>('/skills');
    return response.data;
  },

  // Alias for getAllSkills (used in AddSkillPage)
  getSkills: async (): Promise<Skill[]> => {
    return SkillService.getAllSkills();
  },

  // Get skills by category
  getSkillsByCategory: async (category: string): Promise<Skill[]> => {
    const response = await api.get<Skill[]>(`/skills/categories/${category}`);
    return response.data;
  },

  // Get skill categories
  getSkillCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/skills/categories');
    return response.data;
  },

  // Get skill by ID
  getSkill: async (id: number): Promise<Skill> => {
    const response = await api.get<Skill>(`/skills/${id}`);
    return response.data;
  },

  // Create a new skill (Admin/Recruiter)
  createSkill: async (skill: {
    name: string;
    description?: string;
    category: string;
  }): Promise<Skill> => {
    const response = await api.post<Skill>('/skills', skill);
    return response.data;
  },

  // Update a skill (Admin/Recruiter)
  updateSkill: async (
    id: number,
    skill: { name: string; description?: string; category: string }
  ): Promise<Skill> => {
    const response = await api.put<Skill>(`/skills/${id}`, skill);
    return response.data;
  },

  // Delete a skill (Admin/Recruiter)
  deleteSkill: async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },
};

export default SkillService;
