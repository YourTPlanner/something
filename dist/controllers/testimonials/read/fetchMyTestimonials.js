"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMyTestimonials = void 0;
const supabase_1 = require("../../../lib/supabase");
const apiResponse_1 = require("../../../utils/apiResponse");
const fetchMyTestimonials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.query.userId;
        if (!userId) {
            return (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: "User id is required", statusCode: 400 });
        }
        const testimonialResponse = yield supabase_1.supabase
            .schema("testimonials")
            .from("testimonials")
            .select("*, testimonial_media(photos, videos), testimonial_activities(activities), testimonial_tags(travel_tags)")
            .eq("traveler_id", userId);
        if (testimonialResponse.error || testimonialResponse.status != 200) {
            return (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: (_a = testimonialResponse.error) === null || _a === void 0 ? void 0 : _a.message, reason: testimonialResponse.error, statusCode: testimonialResponse.status });
        }
        const structuredData = testimonialResponse.data.map((testimonial) => {
            const _a = testimonial, { testimonial_activities, testimonial_tags, testimonial_media } = _a, filteredTestimonial = __rest(_a, ["testimonial_activities", "testimonial_tags", "testimonial_media"]);
            return Object.assign(Object.assign({}, filteredTestimonial), { media: testimonial.testimonial_media[0], activities: testimonial.testimonial_activities[0].activities, travel_tags: testimonial.testimonial_tags[0].travel_tags });
        });
        (0, apiResponse_1.apiResponse)({ res, success: true, message: "Testimonials fetched successfully", data: structuredData });
    }
    catch (error) {
        (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: error === null || error === void 0 ? void 0 : error.message, reason: error === null || error === void 0 ? void 0 : error.stack, statusCode: 500 });
    }
});
exports.fetchMyTestimonials = fetchMyTestimonials;
