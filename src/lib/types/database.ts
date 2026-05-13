export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          plan: 'free' | 'pro'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          plan?: 'free' | 'pro'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          plan?: 'free' | 'pro'
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          description?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          title: string
          description: string | null
          due_date: string
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          title: string
          description?: string | null
          due_date: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          title?: string
          description?: string | null
          due_date?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          title: string
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          title: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          title?: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      study_plans: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          title: string
          exam_date: string
          is_public: boolean
          share_slug: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          title: string
          exam_date: string
          is_public?: boolean
          share_slug?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          title?: string
          exam_date?: string
          is_public?: boolean
          share_slug?: string | null
          created_at?: string
        }
      }
      study_plan_items: {
        Row: {
          id: string
          plan_id: string
          topic: string
          scheduled_date: string
          is_completed: boolean
        }
        Insert: {
          id?: string
          plan_id: string
          topic: string
          scheduled_date: string
          is_completed?: boolean
        }
        Update: {
          id?: string
          plan_id?: string
          topic?: string
          scheduled_date?: string
          is_completed?: boolean
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type StudyPlan = Database['public']['Tables']['study_plans']['Row']
export type StudyPlanItem = Database['public']['Tables']['study_plan_items']['Row']
