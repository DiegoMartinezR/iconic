import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class CaseStudiesRest extends BasicRest {
    path = 'case-studies';

    updateViews = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/update-views`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al actualizar vistas"
                );

            return result.data ?? [];
        } catch (error) {
            console.error(error);
            return null;
        }
    };
}

export default CaseStudiesRest;
