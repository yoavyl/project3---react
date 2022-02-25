
class DateService {

    // formats the date from the DB format (%Y-%m-%d) to a presentable format (%d/%m/%Y)
    public yearFirstHyphendToYearLastSlashed(date: string): string {
        const day = date.slice(8);
        const month = date.slice(5, 7);
        const year = date.slice(0, 4);
        const format = day + "/" + month + "/" + year; 
        return format;
    }

    // creates minimum toDate (string for picker) which is one day after fromDate
    public minToDateOneDateAfterFromDateStringTypeForPicker(fromDate: string): string {
        const fromDateAsDateType = new Date(fromDate);
        // add 1 day to fromDate, and turn the result back into string type for picker
        fromDateAsDateType.setDate(fromDateAsDateType.getDate() + 1);
        const minToDate = fromDateAsDateType.toISOString().split("T")[0];  
        return minToDate;
    }

}

const dateService = new DateService();

export default dateService;
