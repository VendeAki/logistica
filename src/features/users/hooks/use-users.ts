import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/features/users/services/users.service';

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: usersService.listProfiles });
