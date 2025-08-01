import { Request, Response } from "express";
import { apiErrorResponse, apiResponse } from "../../utils/apiResponse";
import { supabase } from "../../lib/supabase";
import { getRedisClient } from "../../lib/redis";

interface CloudinaryUploadWebhook {
    notification_type: 'upload';
    timestamp: string;
    request_id: string;
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    width: number;
    height: number;
    format: string;
    resource_type: 'image' | 'video' | 'raw' | 'auto';
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    original_filename: string;
    api_key: string;
    notification_context: {
        triggered_at: string;
        triggered_by: {
            source: string;
            id: string;
        }
    },
    context?: any,
    signature_key: string;
}

export const uploadWebhook = async (req : Request, res : Response) => {
    try {
        const body : CloudinaryUploadWebhook = req.body as CloudinaryUploadWebhook;
        console.log('webhook recived')

        const sessionId = body?.context?.custom?.metadata?.split("=")[1];
        const fileUrl = body?.secure_url;
        const publicId = body?.public_id;
        const todoId = body?.context?.custom?.todoId;

        //console.log(body)

        if (!sessionId || !todoId)
        //return new Response("Missing sessionId or todoId", { status: 400 });
            return apiErrorResponse({ res, success : false, message : "Missing sessionId or todoId", statusCode: 200 });

        // Append the uploaded file info to corresponding todo.uploads array
        const { data: todo } = await supabase
            .from("todos")
            .select("uploads")
            .eq("todo_id", todoId)
            .single();

        const uploads = todo?.uploads || [];
        uploads.push({ public_id: publicId, url: fileUrl });

        await supabase
            .from("todos")
            .update({ uploads :uploads })
            .eq("todo_id", todoId);

            
        apiResponse({
            res,
            success : true,
            message : "Webhook received successfully.",
            statusCode: 200,
            data: body
        });
    }
    catch (error) {
        console.log(error);
        apiErrorResponse({ res, success : false, message : "An error occurred while processing the webhook.", statusCode: 200, reason: error });
    }
}
