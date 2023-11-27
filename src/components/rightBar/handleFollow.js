import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from './axios';

export function useHandleFollow() {
    const queryClient = useQueryClient();
  
    const followMutation = useMutation({
      mutationFn: (userId) => {
        return makeRequest.post(`/relacionamento/${userId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['users']); // Assumindo que você tem uma consulta que busca a lista de usuários
      },
    });
  
    const handleFollow = async (userId, following) => {
      try {
        if (following) {
          await makeRequest.delete(`/relacionamento/${userId}`);
        } else {
          await followMutation.mutateAsync(userId);
        }
        // As mutações de seguir e não seguir devem invalidar as consultas relacionadas aqui
        queryClient.invalidateQueries(['relationship']);
      } catch (error) {
        console.error('Erro ao alterar relação de seguimento', error);
      }
    };
  
    return handleFollow;
}