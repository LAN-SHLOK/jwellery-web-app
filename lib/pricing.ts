//pricing formula applied here

interface PricingInput {
  goldWeightGrams: number;
  todayRatePerGram: number;
  makingChargeType: 'fixed' | 'percentage';
  makingChargeValue: number;
  jewellerMargin: number;
}

export function calculateFinalPrice(input: PricingInput) {
  const { goldWeightGrams, todayRatePerGram, makingChargeType, makingChargeValue, jewellerMargin } = input;

  const goldValue = goldWeightGrams * todayRatePerGram;

  let makingCharges = 0;
  if (makingChargeType === 'fixed') {
    makingCharges = makingChargeValue;
  } else {
    makingCharges = goldValue * (makingChargeValue / 100);
  }

  const subtotal = goldValue + makingCharges + jewellerMargin;
  const gst = subtotal * 0.03;
  const finalPrice = subtotal + gst;

  return {
    goldValue: Math.round(goldValue * 100) / 100,
    makingCharges: Math.round(makingCharges * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    finalPrice: Math.round(finalPrice),
  };
}

export function calculateOrderTotals(subtotalBeforeGst: number) {
  const subtotal = Math.round(subtotalBeforeGst * 100) / 100;
  const gst = Math.round(subtotal * 0.03);

  return {
    gst,
    subtotal,
    total: subtotal + gst,
  };
}

// Show FOMO badge only when today's rate is below the 7-day average.
// Need at least 3 days of history or the comparison is too noisy.
export function shouldShowFomoBadge(todayRate: number, last7DaysRates: number[]) {
  if (last7DaysRates.length < 3) {
    return false;
  }

  const averageRate = last7DaysRates.reduce((sum, rate) => sum + rate, 0) / last7DaysRates.length;
  return todayRate < averageRate;
}
