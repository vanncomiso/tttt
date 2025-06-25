import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { slugify } from '@/lib/utils'
import type { Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  createProject: (project: Omit<ProjectInsert, 'user_id'>) => Promise<{ data: Project | null; error: string | null }>
  updateProject: (id: string, updates: ProjectUpdate) => Promise<{ data: Project | null; error: string | null }>
  deleteProject: (id: string) => Promise<{ error: string | null }>
  getProjectBySlug: (slug: string) => Promise<{ data: Project | null; error: string | null }>
  refreshProjects: () => Promise<void>
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setProjects(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<ProjectInsert, 'user_id'>) => {
    if (!user) {
      return { data: null, error: 'User not authenticated' }
    }

    try {
      // Generate slug if not provided
      const slug = projectData.slug || slugify(projectData.name)
      
      const { data, error: createError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          slug,
          user_id: user.id,
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // Update local state
      setProjects(prev => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      return { data: null, error: errorMessage }
    }
  }

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? data : project
        )
      )

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
      return { data: null, error: errorMessage }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Update local state
      setProjects(prev => prev.filter(project => project.id !== id))

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
      return { error: errorMessage }
    }
  }

  const getProjectBySlug = async (slug: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project'
      return { data: null, error: errorMessage }
    }
  }

  const refreshProjects = async () => {
    await fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectBySlug,
    refreshProjects,
  }
}