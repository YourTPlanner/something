import { Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { apiErrorResponse, apiResponse } from "../../../utils/apiResponse";

export const fetchMyTestimonials = async (req: Request, res: Response) => {
    try {

        const userId = req.query.userId as string;

        if (!userId) {
            return apiErrorResponse({ res, success: false, message: "User id is required", statusCode: 400 });
        }

        const testimonialResponse = await supabase
            .schema("testimonials")
            .from("testimonials")
            .select("*, testimonial_media(photos, videos), testimonial_activities(activities), testimonial_tags(travel_tags)")
            .eq("traveler_id", userId);

        if(testimonialResponse.error || testimonialResponse.status != 200) {
            return apiErrorResponse({ res, success: false, message: testimonialResponse.error?.message, reason: testimonialResponse.error, statusCode: testimonialResponse.status });
        }

        const structuredData = testimonialResponse.data.map((testimonial) => {

            const { testimonial_activities, testimonial_tags, testimonial_media, ...filteredTestimonial } = testimonial as any;

            return {
                ...filteredTestimonial,
                media: testimonial.testimonial_media[0],
                activities: testimonial.testimonial_activities[0].activities,
                travel_tags: testimonial.testimonial_tags[0].travel_tags,
            }
        })

        apiResponse({ res, success: true, message: "Testimonials fetched successfully", data: structuredData });
    }
    catch (error : any) {
        apiErrorResponse({ res, success: false, message: error?.message, reason: error?.stack, statusCode: 500 });
    }
}