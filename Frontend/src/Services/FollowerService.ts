import axios from "axios";
import config from "../Utils/config";
import FollowerModel from '../Models/FollowerModel';

class FollowerService {

    public async addFollower(follower: FollowerModel): Promise<FollowerModel> {
        const response = await axios.post<FollowerModel>(config.urls.addFollower, follower);
        return response.data;
    }

    public async removeFollower(follower: FollowerModel): Promise<FollowerModel> {
        const response = await axios.post<FollowerModel>(config.urls.removeFollower, follower);
        return response.data;
    }

    public async getStats(): Promise<{destination: string, followers: number}[]> {
        const response = await axios.get<{destination: string, followers: number}[]>(config.urls.getStats);
        return response.data;
    }

}

const followerService = new FollowerService();

export default followerService;
