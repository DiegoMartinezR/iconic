import React from "react";


const BrandMultivet = React.lazy(() => import("./Brands/BrandMultivet"));
const BrandInfinite = React.lazy(() => import("./Brands/BrandInfinite"));
const ClientsSectionRhino = React.lazy(() => import("./Brands/ClientsSectionRhino"));

const Brands = ({
    data,
    items,
    which,
    headerPosts,
    filteredData,
    postsLatest,
}) => {
    const getBrand = () => {
        switch (which) {
            case "ClientsSectionRhino":
                return <ClientsSectionRhino data={data} items={items} />;

            case "BrandMultivet":
                return <BrandMultivet data={data} items={items} />
            case "BrandInfinite":
                return <BrandInfinite data={data} items={items} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getBrand();
};

export default Brands;
