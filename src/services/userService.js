import { supabase } from "../lib/supabase";

export const updateUserData = async (email_notifications, userId) => {
  
    const { data, error } = await supabase
        .from("users")
        .update({
        email_notifications,
        })
        .eq("id", userId);
    if (error) {
        console.error("error", error);
    }
    return data;
    }

export const getUserEmailNotification = async (userId) => {
        const { data, error } = await supabase
            .from("users")
            .select("email_notifications")
            .eq("id", userId)
            .single();
        if (error) {
            console.error("error", error);
        }
        return data?.email_notifications;
    }