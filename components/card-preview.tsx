"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/shadcn-io/credit-card";

interface BinApiResponse {
  BIN: {
    Valid: string;
    Number: number;
    Length: number;
  };
  Scheme: string;
  Type: string;
  Brand: string;
  Prepaid: boolean;
  Country: {
    A2: string;
    A3: string;
    N3: string;
    ISD: string;
    Name: string;
    Continent: string;
  };
  Issuer: string
}

// Logo genérico para bancos desconocidos
const BankLogo = ({ name }: { name: string }) => (
  <div className="text-white font-bold text-sm uppercase tracking-wider">
    {name}
  </div>
);

interface CardPreviewProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  onCardInfoUpdate?: (info: {
    bankName: string;
    scheme: "visa" | "mastercard";
    type: "credit" | "debit";
  }) => void;
}

export const CardPreview = ({
  cardNumber,
  expiryDate,
  cvv,
  cardName,
  onCardInfoUpdate,
}: CardPreviewProps) => {
  // Estados de información del banco
  const [bankName, setBankName] = useState("Bank");
  const [cardScheme, setCardScheme] = useState<"Visa" | "Mastercard">("Visa");

  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener información del BIN
  const fetchBinInfo = useCallback(
    async (bin: string) => {
      if (bin.replace(/\s/g, "").length < 6) return;

      const binDigits = bin.replace(/\s/g, "").substring(0, 6);
      const apiKey = process.env.NEXT_PUBLIC_BINBANK_APIKEY;

      if (!apiKey) {
        console.warn("NEXT_PUBLIC_BINBANK_APIKEY no está configurada");
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://data.handyapi.com/bin/${binDigits}`,
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );

        if (response.ok) {
          const data: BinApiResponse = await response.json();
          console.log("BIN Data:", data);
          let newBankName = "Bank";
          let newScheme: "visa" | "mastercard" = "visa";
          let newType: "credit" | "debit" = "credit";

          // Actualizar nombre del banco
          if (data.Issuer ) {
            newBankName = data.Issuer;
            setBankName(newBankName);
          }

          // Actualizar esquema (Visa/Mastercard)
          if (data.Scheme) {
            const scheme = data.Scheme.toLowerCase();
            if (scheme.includes("visa")) {
              setCardScheme("Visa");
              newScheme = "visa";
            } else if (scheme.includes("mastercard")) {
              setCardScheme("Mastercard");
              newScheme = "mastercard";
            }
          }

          // Actualizar tipo (Debit/Credit)
          if (data.Type) {
            const type = data.Type.toLowerCase();
            if (type.includes("debit")) {
              newType = "debit";
            } else if (type.includes("credit")) {
              newType = "credit";
            }
          }

          // Notify parent component
          if (onCardInfoUpdate) {
            onCardInfoUpdate({
              bankName: newBankName,
              scheme: newScheme,
              type: newType,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching BIN info:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onCardInfoUpdate],
  );

  // Efecto para obtener info del BIN cuando cambia el número
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length >= 6) {
      fetchBinInfo(cardNumber);
    }
  }, [cardNumber, fetchBinInfo]);

  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          {/* Logo del banco */}
          <div className="absolute top-4 left-4">
            <BankLogo name={bankName} />
            {isLoading && (
              <div className="text-xs text-blue-300 mt-1">Cargando...</div>
            )}
          </div>

          <CreditCardChip />

          <CreditCardServiceProvider
            type={cardScheme}
            format="logo"
            className="brightness-0 invert absolute top-4 right-4 w-16 h-10"
          />

          <CreditCardName className="absolute bottom-4 left-4">
            {cardName || "NOMBRE DEL TITULAR"}
          </CreditCardName>
        </CreditCardFront>

        <CreditCardBack className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          <CreditCardMagStripe />

          {/* Número de tarjeta */}
          <div className="absolute bottom-20 left-4 right-4">
            <span className="text-[10px] text-blue-300 mb-1 block">
              NÚMERO DE TARJETA
            </span>
            <CreditCardNumber className="text-white">
              {cardNumber || "0000 0000 0000 0000"}
            </CreditCardNumber>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex gap-8">
            {/* Fecha de expiración */}
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-300 mb-1">
                VÁLIDO HASTA
              </span>
              <CreditCardExpiry className="text-white">
                {expiryDate || "00/00"}
              </CreditCardExpiry>
            </div>

            {/* CVV */}
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-300 mb-1">CVV</span>
              <CreditCardCvv className="text-white">
                {cvv || "000"}
              </CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
};

export default CardPreview;
