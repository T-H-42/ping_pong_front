interface UserInfo {
    id: number;
    image_url: string | null;
    ladder_lv: number;
    status: number;
    // userGameHistory: Object,
    userGameHistory: { [key: string]: any };
    achievements: { [key: string]: any };
    username: string;
}
