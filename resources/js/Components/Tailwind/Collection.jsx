import React from "react";

const PaginationCollection = React.lazy(() =>
    import("./Collections/PaginationCollection")
);

const Collection = ({ which, data, items }) => {
    const getCollection = () => {
        switch (which) {
            case "PaginationCollection":
                return <PaginationCollection data={data} items={items} />;

            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getCollection();
};

export default Collection;
