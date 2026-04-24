import React from "react";
import { useNavigate } from "react-router-dom";
import PackageCard from "../../components/common/packageCard";
import { createRecharge } from "../../api/payments";
import useAuth from "../../hooks/useAuth";

const Packages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlanId, setLoadingPlanId] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");

  const plans = [
    { id: 1, name: "Starter", tokens: 20, price: "2 DT", amount: 2 },
    { id: 2, name: "Basic", tokens: 50, price: "4.5 DT", amount: 4.5 },
    {
      id: 3,
      name: "Value",
      tokens: 80,
      price: "7 DT",
      amount: 7,
      popular: true,
    },
    { id: 4, name: "Standard", tokens: 120, price: "10.5 DT", amount: 10.5 },
    { id: 5, name: "Pro", tokens: 200, price: "18 DT", amount: 18 },
    { id: 6, name: "Premium", tokens: 300, price: "27 DT", amount: 27 },
  ];

  const handlePurchase = async (plan) => {
    try {
      setErrorMessage("");
      setLoadingPlanId(plan.id);

      const resolvedUserId = user?.user_id || user?.id;
      if (!resolvedUserId) {
        throw new Error(
          "Session utilisateur introuvable. Merci de vous reconnecter.",
        );
      }

      const response = await createRecharge({
        user_id: resolvedUserId,
        amount: plan.amount,
        platform: "web",
        web_redirect: `${window.location.origin}/packages`,
      });

      if (!response?.payment_url) {
        throw new Error(response?.error || "Lien de paiement indisponible.");
      }

      window.location.href = response.payment_url;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error ||
          error?.response?.data?.details ||
          error?.message ||
          "Échec de création du paiement.",
      );
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] px-5 py-[60px] font-sans">
      <div className="relative mx-auto mb-[50px] flex max-w-[1000px] items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 border-none bg-transparent text-base font-semibold text-[#1e5470] cursor-pointer hover:underline"
        >
          &#8592; Back
        </button>
        <h2 className="m-0 text-[2.2rem] font-bold text-[#1e5470]">
          Select your Token Package
        </h2>
      </div>
      {errorMessage && (
        <div className="mx-auto mb-5 max-w-[1000px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-[25px]">
        {plans.map((plan) => (
          <PackageCard
            key={plan.id}
            plan={plan}
            onPurchase={handlePurchase}
            isLoading={loadingPlanId === plan.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Packages;
