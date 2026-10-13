import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import { X } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

import "swiper/css";

const AdSubscription = ({ data, items, generals }) => {
  const subscriptionsRest = new SubscriptionsRest();
  const emailRef = useRef();
  const [modalOpen, setModalOpen] = useState(items.length > 0);
  const [saving, setSaving] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  const openModal = () => setPolicyModalOpen(true);
  const closePolicyModal = () => setPolicyModalOpen(false);

  const closeModal = () => setModalOpen(false);

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const request = {
      email: emailRef.current.value,
    };
    const result = await subscriptionsRest.save(request);
    setSaving(false);

    if (!result) return;

    Swal.fire({
      title: "¡Éxito!",
      text: "Te has suscrito correctamente a nuestro boletín.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    emailRef.current.value = null;
    closeModal();
  };

  return (
    <>
      <ReactModal
        isOpen={modalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Suscripción"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-green-600 hover:text-green-800 transition-all duration-300 z-10"
        >
          <X width="1.5rem" strokeWidth="3px" />
        </button>

        {items && items.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 5000 }}
            className="w-full h-full"
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <img
                      src={`/api/ads/media/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg aspect-[4/3]"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-600 mb-4 leading-none">
                      {item.name}
                    </h2>

                    <form onSubmit={onEmailSubmit}>
                      <div className="relative mb-4">
                        <input
                          ref={emailRef}
                          type="email"
                          placeholder="Ingresa tu correo electrónico"
                          disabled={saving}
                          className="w-full text-gray-700 font-semibold shadow-xl py-3 pl-5 pr-5 border rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="mb-4 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="privacy-policy"
                          required
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="privacy-policy" className="text-sm">
                          Acepto la <button
                            type="button"
                            onClick={() => openModal(1)}
                            className="text-green-600 underline hover:font-bold transition-all duration-300"
                          >
                            política de privacidad
                          </button>
                        </label>
                      </div>
                      <div className="relative">
                        <Tippy content="Enviar">
                          <button
                            className="w-full py-2 px-4 font-bold shadow-xl bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Enviar"
                            disabled={saving}
                          >
                            Enviar
                          </button>
                        </Tippy>
                      </div>
                    </form>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </ReactModal>

      <ReactModal
        isOpen={policyModalOpen}
        onRequestClose={closePolicyModal}
        contentLabel="Política de privacidad"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <button onClick={closePolicyModal} className="float-right text-red-500 hover:text-red-700 transition-all duration-300">
          <X width="2rem" strokeWidth="4px" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Política de privacidad</h2>
        <div className="min-h-80">
        <HtmlContent className="prose" html={generals?.find(x => x.correlative == 'privacy_policy')?.description ?? ''} />
        </div>
      </ReactModal>
    </>
  );
};

export default AdSubscription;