class VacationModel {
	public id: number;
    public details: string;
    public destination: string;
    public price: number;
    public followers: number;
    public imageName: string;
    public fromDate: string;
    public toDate: string;
    public image: FileList;
    public isUserFollowing: boolean;
}

export default VacationModel;
