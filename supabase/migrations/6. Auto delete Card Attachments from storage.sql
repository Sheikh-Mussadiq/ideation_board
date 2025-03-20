
-- Step 1: Create helper function to delete storage objects
CREATE OR REPLACE FUNCTION delete_storage_object(bucket_name TEXT, path TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM storage.objects
    WHERE bucket_id = bucket_name AND name = path;
EXCEPTION WHEN others THEN
    -- Optional error handling
    RAISE WARNING 'Error deleting object: %', SQLERRM;
END;
$$;

-- Step 2: Create trigger function to process attachments
CREATE OR REPLACE FUNCTION delete_card_attachments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    attachment JSONB;
BEGIN
    IF OLD.attachments IS NOT NULL THEN
        FOR attachment IN SELECT * FROM jsonb_array_elements(OLD.attachments)
        LOOP
            IF (attachment->>'type') = 'file' AND (attachment->>'storagePath') IS NOT NULL THEN
                PERFORM delete_storage_object('ideation_media', attachment->>'storagePath');
            END IF;
        END LOOP;
    END IF;
    RETURN OLD;
END;
$$;

-- Step 3: Create the trigger
CREATE TRIGGER delete_card_attachments_trigger
BEFORE DELETE ON cards
FOR EACH ROW
EXECUTE FUNCTION delete_card_attachments();

REVOKE EXECUTE ON FUNCTION delete_storage_object FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION delete_card_attachments FROM PUBLIC;

GRANT EXECUTE ON FUNCTION delete_storage_object TO service_role;
GRANT EXECUTE ON FUNCTION delete_card_attachments TO service_role;

-- Create a policy to allow DELETE access for service_role on the ideation_media bucket
CREATE POLICY "Allow service_role to delete objects"
ON storage.objects
FOR DELETE
TO service_role
USING (
    bucket_id = 'ideation_media'
);
