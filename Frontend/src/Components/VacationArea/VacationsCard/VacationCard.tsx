import VacationModel from "../../../Models/VacationModel";
import config from "../../../Utils/config";
import missingPath from "../../../Assets/Images/404.png";
import "./VacationCard.css";
import { useNavigate } from "react-router-dom";
import myVacationService from "../../../Services/VacationService";
import myFollowerService from "../../../Services/FollowerService";
import { BiX, BiEditAlt } from 'react-icons/bi';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { useState } from "react";
import UserModel from "../../../Models/UserModel";
import FollowerModel from "../../../Models/FollowerModel";
import notifyService from "../../../Services/NotifyService";
import dateService from "../../../Services/DateService"

interface VacationCardProps {
	vacation: VacationModel;
    user: UserModel;
    isAdmin: boolean;
}

function VacationCard(props: VacationCardProps): JSX.Element {

    const [isUserFollowing, setIsUserFollowing] = useState<boolean>(props.vacation.isUserFollowing);

    const navigate = useNavigate();

    async function deleteVacation() {
        const answer: boolean = window.confirm("Are you sure you want to delete this vacation?");
        if (!answer) return;
        try {
            await myVacationService.deleteVacation(props.vacation?.id);
            notifyService.success(`Vacation deleted!`);
            navigate("/home");
        }
        catch(err: any) {
            alert(err.message);
        }
    }

    async function addFollower() {
        if (props.isAdmin) return
        try {
            const follower = new FollowerModel();
            follower.vacationId = props.vacation.id;
            follower.userId = props.user.id
            await myFollowerService.addFollower(follower);
            props.vacation.followers+=1;

            // for UI
            props.vacation.isUserFollowing = true; // for logout/login purposes
            setIsUserFollowing(true);
        }
        catch(err: any) {
            // alert(err.message);
        }
    }

    async function removeFollower() {
        // if admin - block it also on dom level
        if (props.isAdmin) return
        try {
            const follower = new FollowerModel();
            follower.vacationId = props.vacation.id;
            follower.userId = props.user.id
            await myFollowerService.removeFollower(follower);
            props.vacation.followers-=1;
            
            // for UI
            props.vacation.isUserFollowing = false; // for logout/in purposes
            setIsUserFollowing(false);
        }
        catch(err: any) {
            alert(err.message);
        }
    }


    return (
        // <div key={props.vacation?.id} className="VacationCard">
        <div className="VacationCard">
             <p>
                {!props.isAdmin && <>
                    {isUserFollowing && <button onClick={removeFollower} ><FcLike /></button>}
                    {isUserFollowing || <button onClick={addFollower} ><FcLikePlaceholder /></button>}
                    <span> {props.vacation.followers} </span>
                </>}
                {props.isAdmin && <button onClick={ () => navigate("/update-vacation/" + props.vacation.id)} ><BiEditAlt /></button>}
                {props.isAdmin && <button onClick={deleteVacation}><BiX /></button>}
            </p>
            <img src={config.urls.vacationImages + props.vacation.imageName}
            onError={({ currentTarget }) => {
                if (currentTarget.src !== missingPath ) {
                    currentTarget.src = missingPath;  
                }
              }}
              width={150} height={150} alt={""} />
			<div className="Destination">Destination: {props.vacation.destination}</div>
            <div className="Details">Details: {props.vacation.details}</div>
            <div className="Date">From: {dateService.yearFirstHyphendToYearLastSlashed(props.vacation.fromDate)}</div>
            <div className="Date">To: {dateService.yearFirstHyphendToYearLastSlashed(props.vacation.toDate)}</div>
            <div className="Price">Price: {props.vacation.price}</div>       
        </div>
    );
}

export default VacationCard;
