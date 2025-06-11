import { useState } from 'react';
import { toast } from 'sonner';
import { postService } from '@/services/post.service';
import { ReportType, CreateReportRequest } from '@/types/postTypes';

export const useReporting = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Signaler un post avec la nouvelle API
     */
    const reportPost = async (data: CreateReportRequest) => {
        setIsSubmitting(true);

        try {
            await postService.createReport(data);

            toast.success("Signalement envoyé", {
                description: "Merci de nous aider à maintenir une communauté saine. Nous examinerons ce signalement.",
            });

            return { success: true };
        } catch (error) {
            console.error("Erreur lors du signalement:", error);

            toast.error("Impossible d'envoyer le signalement", {
                description: "Une erreur est survenue. Veuillez réessayer plus tard.",
            });

            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
 * Signalement rapide pour mobile
 */
    const quickReportPost = async (postId: string, reportType: ReportType, description?: string) => {
        setIsSubmitting(true);

        try {
            await postService.quickReport(postId, {
                reportType,
                description,
            });

            toast.success("Signalement envoyé");

            return { success: true };
        } catch (error) {
            console.error("Erreur lors du signalement rapide:", error);

            toast.error("Impossible d'envoyer le signalement");

            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Obtenir mes signalements
     */
    const getMyReports = async () => {
        try {
            const response = await postService.getMyReports();
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Erreur lors de la récupération des signalements:", error);

            toast.error("Impossible de charger vos signalements");

            return { success: false, error };
        }
    };

    return {
        reportPost,
        quickReportPost,
        getMyReports,
        isSubmitting,
    };
}; 