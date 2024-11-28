import { useState, useEffect } from "react";
import Menu from './../components/menu';
import { useRouter } from 'next/navigation';
import { connectMetaMask, disconnectMetaMask, onAccountAndNetworkChanged } from "../../services/web3services";
import Image from "next/image";

interface HeaderProps {
  setWalletResponse: (walletResponse: string | null) => void;
}

export default function Header({ setWalletResponse }: HeaderProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      setWallet(storedWallet);
    }
  
    const handleAccountChange = (newAccount: string | null) => {
      if (newAccount) {
        setError("");
        setWallet(newAccount);
        localStorage.setItem("wallet", newAccount);
        router.push('/');
      } else {
        console.log("Nenhuma conta conectada.");
      }
    };
  
    const handleNetworkChange = (isCorrectNetwork: boolean) => {
      if (isCorrectNetwork) {
        setError("");
        router.push('/');
      } else {
        setWallet("");
        setError("Conecte-se à rede Sepolia.");
        router.push('/');
      }
    };
  
    onAccountAndNetworkChanged(handleAccountChange, handleNetworkChange);
  
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
      window.ethereum.removeListener("chainChanged", handleNetworkChange);
    };
  
  }, [setWallet, router]); 

  const handleConnectMetaMask = async () => {
    try {
      const account = await connectMetaMask();
      if (account) {
        setWallet(account);
        localStorage.setItem("wallet", account);
        router.push('/property');
      } else {
        setError("Nenhuma conta MetaMask conectada.");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDisconnectMetaMask = () => {
    setWallet(disconnectMetaMask());
    localStorage.removeItem("wallet");
    router.push('/');
  };

  return (
    <header className="m-0 p-0 relative w-full">
      <div className="container mx-auto relative p-0">
        <nav className="flex flex-wrap items-center justify-between m-0 p-2">

          <div className="bg-white rounded-2xl m-0 p-0">
            <Image
              src="/logo.png"
              className="object-contain m-0 p-0 bg-white"
              alt="Firmeza Token"
              width="80"
              height="80"
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              {wallet ? (
                <div>
                  <p className="text-font-inter text-xs">Carteira: {wallet.slice(0, 6) + "..." + wallet.slice(-4)}
                  </p>
                  <button onClick={handleDisconnectMetaMask}>Desconectar</button>
                </div>
              ) : (
                <button onClick={handleConnectMetaMask}>Conectar MetaMask</button>
              )}
              {error && <p className="text-red-500 text-font-inter text-xs">{error}</p>}
            </div>
          </div>
        </nav>

        {/* Renderiza o menu abaixo dos itens de conexão */}
        {wallet && (
          <nav className="max-w-full flex-grow flex navintro mt-1">
            <div>
              <Menu />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}