
export interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    thumbnail_url?: string;
}

export const InstagramService = {
    getFeed: async (): Promise<InstagramPost[] | null> => {
        const token = process.env.INSTAGRAM_ACCESS_TOKEN;

        // If no token, return null so frontend uses fallback
        if (!token) return null;

        try {
            // "me/media" works for Instagram Basic Display API
            // For Graph API, we would need to fetch the User ID first. 
            // We'll stick to Basic Display endpoint structure as it's the direct "self-token" standard.
            const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=5`;

            const res = await fetch(url, {
                next: { revalidate: 3600 } // Cache for 1 hour
            });

            if (!res.ok) {
                console.error("Instagram API Error:", res.statusText);
                return null;
            }

            const data = await res.json();

            if (data.error) {
                console.error("Instagram API Error Message:", data.error.message);
                return null;
            }

            return data.data;
        } catch (error) {
            console.error("Instagram Service Exception:", error);
            return null;
        }
    }
};
