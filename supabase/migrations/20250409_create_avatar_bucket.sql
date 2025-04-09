
-- Criar um bucket para armazenar imagens de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas de acesso para o bucket de avatares
BEGIN;

-- Políticas de armazenamento para leitura pública
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Políticas para permitir que usuários autenticados façam upload de seus avatares
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'profile_images'
  );

-- Políticas para permitir que usuários autenticados atualizem seus avatares
CREATE POLICY "Users can update their own avatars"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'profile_images'
  );

COMMIT;
