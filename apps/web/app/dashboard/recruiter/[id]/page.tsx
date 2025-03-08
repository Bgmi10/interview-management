import JobDetail from "../../../components/recruiter/JobDetail";

    export default function ({ params }: { params: { id: string } }) {
        return(
            <div>
                <JobDetail params={params} />
            </div>
        );
    }
