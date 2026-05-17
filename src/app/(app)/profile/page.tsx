import { getToken } from '@/app/actions/auth';
import { apiFetch } from '@/lib/api';
import ProfileForm from '@/components/profile/ProfileForm';
import ExperienceSection from '@/components/profile/ExperienceSection';
import EducationSection from '@/components/profile/EducationSection';
import SkillsSection from '@/components/profile/SkillsSection';
import CvUploadSection from '@/components/profile/CvUploadSection';

interface Profile {
  id: string;
  fullName: string;
  title?: string;
  summary?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: number;
}

export default async function ProfilePage() {
  const token = await getToken();
  const profile = await apiFetch<Profile>('/api/profile', {}, token!).catch(() => null);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Esta información se usa para generar tus CVs</p>
      </div>

      <CvUploadSection token={token!} />

      <ProfileForm profile={profile} />
      <ExperienceSection experiences={profile?.experiences ?? []} />
      <EducationSection educations={profile?.educations ?? []} />
      <SkillsSection skills={profile?.skills ?? []} />
    </div>
  );
}
