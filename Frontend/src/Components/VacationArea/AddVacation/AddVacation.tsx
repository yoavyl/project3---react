import "./AddVacation.css";
import myVacationService from "../../../Services/VacationService";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { SyntheticEvent, useEffect, useState } from "react";
import notifyService from "../../../Services/NotifyService";
import dateService from "../../../Services/DateService";


function AddVacation(): JSX.Element {

    const [minToDate, setMinToDate] = useState<string>();

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>({
        mode: 'onBlur' // Validation will trigger on the change event with each input,
    });

    const navigate = useNavigate();

    const minFromDate = new Date().toISOString().split("T")[0];  // today

    useEffect( () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        setMinToDate(tomorrow.toISOString().split("T")[0]); // today + 1 (tomorrow)
    }, [] );
    

    async function submit(vacation: VacationModel) {
        try {
            await myVacationService.addVacation(vacation);
            notifyService.success(`Vacation to ${vacation.destination} was added!`);
            navigate("/home");
        }
        catch(err: any) {
            notifyService.error(err);
        }
    }

    // on change in fromDate value
    function setMinToDateOnChange(args: SyntheticEvent) {
        const selectedFromDate = (args.target as HTMLSelectElement).value;
        const minToDate = dateService.minToDateOneDateAfterFromDateStringTypeForPicker(selectedFromDate);

        // set it as new default value to toDate, and also as minimum date on datepicker
        setValue("toDate", minToDate);
        setMinToDate(minToDate);
    }

    // in case admin writes the dates (instead of picking using the picker, which has min date set):
    // custom validation function: validates if toDate is after/equal to minToDate 
    // (= fromDate+1, see setMinToDateOnChange)
    function validateToDate(toDate: string): boolean {
        if (toDate < minToDate) return false;
        if (toDate >= minToDate) return true;
    }

    // custom validation function: validates if fromDate is after/equal to minFromDate 
    function validateFromDate(toDate: string): boolean {
        if (toDate < minFromDate) return false;
        if (toDate >= minFromDate) return true;
    }

    return (
        <div className="AddVacation">
			<h2>Add A Vacation</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Details: </label>
                <input type="text" {...register("details", {
                    required:  "Missing details",
                    minLength: { value: 2, message: "Details must be minimum 2 chars" },
                    maxLength: { value: 100, message: "Details can't exceed 100 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })} />
                <span>{formState.errors.details?.message}</span>

                <label>Deastination: </label>
                <input type="text"  {...register("destination", {
                    required:  "Missing destination",
                    minLength: { value: 2, message: "Deastination must be minimum 2 chars" },
                    maxLength: { value: 100, message: "Deastination can't exceed 100 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })} />
                <span>{formState.errors.destination?.message}</span>

                <label>Price ($): </label>
                <input type="number" step="0.1" {...register("price", {
                    required: { value: true, message: "Missing price" },
                    min: { value: 0, message: "Price can't be negative" },
                    max: { value: 1000, message: "Price can't exceed $1000" }
                })}  />
                <span>{formState.errors.price?.message}</span>

                <label>From Date: </label>
                <input type="date"  
                min={minFromDate}
                {...register("fromDate", {
                    required: { value: true, message: "Missing start date" },
                    validate: { value: toDate => validateFromDate(toDate) === true  || "From date can't be before today" },
                })}
                onChange={setMinToDateOnChange}
                />
                <span>{formState.errors.fromDate?.message}</span>

                <label>To Date: </label>
                <input type="date" 
                min={minToDate}
                {...register("toDate", {
                    required: { value: true, message: "Missing end date" },
                    validate: { value: toDate => validateToDate(toDate) === true  || "To date must be after from date" },
                })} />
                <span>{formState.errors.toDate?.message}</span>

                <label>Image:</label>
                <input type="file" accept="image/*" {...register("image", {
                    required: { value: true, message: "Missing image" }
                })} />
                <span>{formState.errors.image?.message}</span>

                <button>Add</button>

            </form>

        </div>
    );
}

export default AddVacation;
