import CategoryCardWithBanner from "./Components/CategoryCardWithBanner";

const CategoryPrettyGrid = ({ data, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <section id={data?.element_id || null} className={`font-paragraph ${data?.class_section || ""}`}>
          <div className="px-primary 2xl:px-0">
            <div className="2xl:max-w-7xl mx-auto py-12 md:py-16">
              <h2 className="text-3xl md:text-4xl text-center font-bold mb-10 md:mb-16">{data?.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[2.5%]">

                  <div className="w-full">
                      {items[0] && (
                        <CategoryCardWithBanner
                            href={`/${data?.path}/${items[0].slug}`}
                            borderRadius={data?.borderRadius}
                            aspectRatio={616 / 500}
                            category={items[0]}
                            mainContainer
                        />
                      )}
                  </div>
                  {items.length > 1 && (
                    <div className="grid grid-rows-2 gap-6 md:gap-[5%]">
                        {items.slice(1, 3).map((category, index) => (
                            <CategoryCardWithBanner
                            href={`/${data?.path}/${category.slug}`}
                                borderRadius={data?.borderRadius}
                                aspectRatio={44 / 17}
                                key={category.id}
                                index={index}
                                buttonBackground={index == 0 ? 'bg-white' : ''}
                                buttonColor={index == 0 ? 'customtext-primary' : ''}
                                color={index == 1 ? 'customtext-primary' : ''}
                                category={category}
                            />
                        ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
      </section>

    );
}

export default CategoryPrettyGrid;