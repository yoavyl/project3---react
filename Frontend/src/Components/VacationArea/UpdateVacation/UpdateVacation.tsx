import { SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import myVacationService from "../../../Services/VacationService";
import config from "../../../Utils/config";
import missingPath from "../../../Assets/Images/404.png";
import "./UpdateVacation.css";
import notifyService from "../../../Services/NotifyService";
import dateService from "../../../Services/DateService"


function UpdateVacation(): JSX.Element {

    const [vacation, setVacation] = useState<VacationModel>();
    const [minToDate, setMinToDate] = useState<string>();

    const params = useParams();

    useEffect((async () => {
        // on load - set this vacation's values as all inputs default values (except image input)
        try {
            const vacation = await myVacationService.getOneVacation(+params.id);
            setVacation(vacation);
            setValue("details", vacation.details);
            setValue("destination", vacation.destination);
            setValue("price", vacation.price);
            setValue("fromDate", vacation.fromDate);
            setValue("toDate", vacation.toDate);
            const minToDate = dateService.minToDateOneDateAfterFromDateStringTypeForPicker(vacation.fromDate);
            setMinToDate(minToDate);         
        } catch (err:any) {
            alert(err.message)
        }
    }) as any, []);


    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>({
        mode: 'onBlur'   // Validation will trigger on the change event with each input
    });

    const navigate = useNavigate();

    async function submit(vacation: VacationModel) {
        try {
            vacation.id = +params.id;
            await myVacationService.updateVacation(vacation);
            notifyService.success(`Vacation to ${vacation.destination} was updated!`);
            navigate("/home");
        }
        catch(err: any) {
            notifyService.error(err);
        }
    }
    
    function setMinToDateOnChange(args: SyntheticEvent) {
        const selectedFromDate = (args.target as HTMLSelectElement).value;

        const minToDate = dateService.minToDateOneDateAfterFromDateStringTypeForPicker(selectedFromDate);
        setMinToDate(minToDate); // fromDate + 1 

        // since in update there is an existing end date value, 
        // check if end date before new start date (we don't want that)
        // if yes: set new default value to toDate to be after fromDate
        if (selectedFromDate >= vacation?.toDate) setValue("toDate", minToDate);
    }

    // in case admin writes the dates (instead of picking using the picker, which has min date set):
    //  custom validation function: validates if toDate is after/equal to minToDate 
    // (= fromDate+1, see setMinToDateOnChange)
    function validateToDate(toDate: string): boolean {
        if (toDate < minToDate) return false;
        if (toDate >= minToDate) return true;
    }
    
    return (
        <div className="UpdateVacation">
			<h2>Update This Vacation</h2>
            <h4>(rewrite only the fields you wish to update)</h4>

            <form onSubmit={handleSubmit(submit)}>

                <label>Details: </label>
                <input type="text" 
                 {...register("details", {
                    required:  "Missing details",
                    minLength: { value: 2, message: "Details must be minimum 2 chars" },
                    maxLength: { value: 100, message: "Details can't exceed 100 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })} />
                <span>{formState.errors.details?.message}</span>

                <label>Deastination: </label>
                <input type="text"  
                {...register("destination", {
                    required:  "Missing destination",
                    minLength: { value: 2, message: "Deastination must be minimum 2 chars" },
                    maxLength: { value: 100, message: "Deastination can't exceed 100 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })} />
                <span>{formState.errors.destination?.message}</span>

                <label>Price ($): </label>
                <input type="number" step="0.1" 
                {...register("price", {
                    required: "Missing price",
                    min: { value: 0, message: "Price can't be negative" },
                    max: { value: 1000, message: "Price can't exceed $1000" }
                })}  />
                <span>{formState.errors.price?.message}</span>

                <label>From Date: </label>
                <input type="date" 
                // min={minFromDate}
                {...register("fromDate", {
                    required: "Missing from date",
                    // validate: { value: toDate => validateFromDate(toDate) === true  || "From date can't be before today" },
                })} 
                onChange={setMinToDateOnChange}
                />
                <span>{formState.errors.fromDate?.message}</span>


                <label>To Date: </label>
                <input type="date"  
                min={minToDate}
                {...register("toDate", {
                    required: "Missing to date",
                    validate: { value: toDate => validateToDate(toDate) === true  || "To date must be after from date" },
                })} />
                <span>{formState.errors.toDate?.message}</span>

                Current Image:
                <br/>
                <img src={config.urls.vacationImages + vacation?.imageName}
                onError={({ currentTarget }) => {
                if (currentTarget.src !== missingPath ) {
                    currentTarget.src= missingPath;  
                }
                }} />

                <br/>
                <label>Replace Image?:</label>
                <input type="file" accept="image/*" {...register("image")} />
                {/* new image is not required */}

                <button>Update</button>

            </form>
        </div>
    );
}

export default UpdateVacation;

