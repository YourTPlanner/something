import { Request, Response } from "express";
import { apiErrorResponse, apiResponse } from "../../../utils/apiResponse";
import { envLoader } from "../../../utils/envLoader";
import { supabase } from "../../../lib/supabase";
import axios from "axios";

export const fetchPackageTripDetails = async (req: Request, res: Response) => {
    try {
        const { packageId, tripId } = req.query;
        
        if (!packageId) return apiResponse({res, success: false, message: "Package ID is required"});
        if (!tripId) return apiResponse({res, success: false, message: "Trip ID is required"});
        
        let packageData = null;
        
        try {
            const response = await axios.get(`${envLoader.PACKAGE_SERVICE_URL}/${packageId}`);

            if (response.status !== 200) {
                return apiErrorResponse({res, success: false, message: "Error in fetching package details", reason :response.statusText});
            }

            const {
                package_id,
                total_duration,
                destinations : { destinations },
                travel_tags,
                vendor_id
            } = response.data.data.general;
            
            const accomodations = response.data.data.accommodations[0].type_of_stay;
            const transportation = [...new Set(response?.data?.data.transfers.map((t:any) => t.mode_of_transport))].join(', ');
            const acitivites : string[] = response?.data?.data.activities.map((acc : any) => acc.activity_type) || [];

            packageData = {
                package_id,
                total_duration,
                city_traveled : destinations,
                travel_tags,
                accomodations,
                transportation,
                vendor_id,
                acitivites : acitivites.filter((item, index) => acitivites.indexOf(item) === index)
            }
        }
        catch (error) {
            console.log(error);
            return apiErrorResponse({res, success: false, message: "Error in fetching package details", reason : error});    
        }

        try {

            const tripSupabaseResponse = await supabase.schema("my_trips").from("base_trips").select("trip_id, number_of_person").eq("trip_id", tripId).single();

            if (!tripSupabaseResponse.data || tripSupabaseResponse.status !== 200) {
                return apiErrorResponse({res, success: false, message: "Error in fetching trip details", reason : tripSupabaseResponse.error});
            }

            let travel_type : string = "";
            const number_of_person = tripSupabaseResponse.data.number_of_person;

            switch (parseInt(number_of_person)) {
                case 1:
                    travel_type = "Solo";
                    break;
                case 2:
                    travel_type = "Couple";
                    break;
                case 3:
                    travel_type = "Family";
                    break;
                case 4:
                    travel_type = "Group";
                    break;
                default:
                    travel_type = "Group";
                    break;
            }

            packageData = {
                ...packageData,
                number_of_person,
                travel_type : travel_type
            }
        }
        catch (error) {
            return apiErrorResponse({res, success: false, message: "Error in fetching trip details", reason : error});    
        }
       
        apiResponse({
            res,
            success: true,
            message: "Testimonial fetched successfully",
            data: packageData,
        })
    }
    catch (error) {
        console.log(`Error in getTestimonialById: ${error}`);
        apiErrorResponse({
            res,
            success: false,
            message: "Error in getTestimonialById",
            reason: error,
            statusCode : 500
        })
    }
}