"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardLogo,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/shadcn-io/credit-card";
import type { HTMLAttributes } from "react";

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
  Issuer: string;
}

// Logo genérico para bancos desconocidos
const BankLogo = ({ name }: { name: string }) => (
  <div className="text-white font-bold text-sm uppercase tracking-wider">
    {name}
  </div>
);


interface CardBankProps {
  initialNumber?: string;
  initialExpiry?: string;
  initialCvv?: string;
  initialName?: string;
}

export const CardBank = ({
  initialNumber = "4757 7447 1880 1226",
  initialExpiry = "07/30",
  initialCvv = "943",
  initialName = "Diego Letelier",
}: CardBankProps) => {
  const [cardNumber, setCardNumber] = useState(initialNumber);
  const [expiryDate, setExpiryDate] = useState(initialExpiry);
  const [cvv, setCvv] = useState(initialCvv);
  const cardName = initialName;

  // Estados de edición
  const [editingNumber, setEditingNumber] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [editingCvv, setEditingCvv] = useState(false);

  // Estados de información del banco
  const [bankName, setBankName] = useState("Bank");
  const [cardScheme, setCardScheme] = useState<"Visa" | "Mastercard">("Visa");
  const [cardType, setCardType] = useState<"Debit" | "Credit">("Credit");
  const [isLoading, setIsLoading] = useState(false);

  // Refs para inputs
  const numberInputRef = useRef<HTMLInputElement>(null);
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);

  // Función para obtener información del BIN
  const fetchBinInfo = useCallback(async (bin: string) => {
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
        console.log(data);

        // Actualizar nombre del banco
        if (data.Issuer) {
          setBankName(data.Issuer);
        }

        console.log(data.Issuer);

        // Actualizar esquema (Visa/Mastercard)
        if (data.Scheme) {
          const scheme = data.Scheme.toLowerCase();
          if (scheme.includes("visa")) {
            setCardScheme("Visa");
          } else if (scheme.includes("mastercard")) {
            setCardScheme("Mastercard");
          }
        }

        // Actualizar tipo (Debit/Credit)
        if (data.Type) {
          const type = data.Type.toLowerCase();
          if (type.includes("debit")) {
            setCardType("Debit");
          } else if (type.includes("credit")) {
            setCardType("Credit");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching BIN info:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para obtener info del BIN cuando cambia el número
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length >= 6) {
      fetchBinInfo(cardNumber);
    }
  }, [cardNumber, fetchBinInfo]);

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Handlers para edición
  const handleNumberDoubleClick = () => {
    setEditingNumber(true);
    setTimeout(() => numberInputRef.current?.focus(), 0);
  };

  const handleExpiryDoubleClick = () => {
    setEditingExpiry(true);
    setTimeout(() => expiryInputRef.current?.focus(), 0);
  };

  const handleCvvDoubleClick = () => {
    setEditingCvv(true);
    setTimeout(() => cvvInputRef.current?.focus(), 0);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setExpiryDate(formatExpiry(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleNumberBlur = () => {
    setEditingNumber(false);
  };

  const handleExpiryBlur = () => {
    setEditingExpiry(false);
  };

  const handleCvvBlur = () => {
    setEditingCvv(false);
  };

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
            {cardName}
          </CreditCardName>
        </CreditCardFront>

        <CreditCardBack className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          <CreditCardMagStripe />

          {/* Número de tarjeta editable */}
          <button
            type="button"
            className="absolute bottom-20 left-4 right-4 text-left"
            onDoubleClick={handleNumberDoubleClick}
          >
            <span className="text-[10px] text-blue-300 mb-1 block">
              NÚMERO DE TARJETA
            </span>
            {editingNumber ? (
              <input
                ref={numberInputRef}
                type="text"
                value={cardNumber}
                onChange={handleNumberChange}
                onBlur={handleNumberBlur}
                className="w-full bg-transparent text-white text-lg tracking-widest font-mono outline-none border-b border-blue-400"
                placeholder="0000 0000 0000 0000"
              />
            ) : (
              <CreditCardNumber className="cursor-pointer hover:text-blue-200 transition-colors">
                {cardNumber}
              </CreditCardNumber>
            )}
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex gap-8">
            {/* Fecha de expiración editable */}
            <button
              type="button"
              className="flex flex-col text-left"
              onDoubleClick={handleExpiryDoubleClick}
            >
              <span className="text-[10px] text-blue-300 mb-1">
                VÁLIDO HASTA
              </span>
              {editingExpiry ? (
                <input
                  ref={expiryInputRef}
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  onBlur={handleExpiryBlur}
                  className="w-20 bg-transparent text-white text-base font-mono outline-none border-b border-blue-400"
                  placeholder="MM/YY"
                />
              ) : (
                <CreditCardExpiry className="cursor-pointer hover:text-blue-200 transition-colors">
                  {expiryDate}
                </CreditCardExpiry>
              )}
            </button>

            {/* CVV editable */}
            <button
              type="button"
              className="flex flex-col text-left"
              onDoubleClick={handleCvvDoubleClick}
            >
              <span className="text-[10px] text-blue-300 mb-1">CVV</span>
              {editingCvv ? (
                <input
                  ref={cvvInputRef}
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  onBlur={handleCvvBlur}
                  className="w-16 bg-transparent text-white text-base font-mono outline-none border-b border-blue-400"
                  placeholder="123"
                />
              ) : (
                <CreditCardCvv className="cursor-pointer hover:text-blue-200 transition-colors">
                  {cvv}
                </CreditCardCvv>
              )}
            </button>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
};

export default CardBank;
