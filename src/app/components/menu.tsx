import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css'; // Inclua Bootstrap se necessário


const Menu: React.FC = () => {
  return (
    <nav className="w-full flex flex-col md:flex-row md:justify-center bg-navintro">
      <div className="w-full max-w-screen-lg flex flex-wrap justify-center">
        <ul className="w-full flex flex-col md:flex-row md:justify-center text-black gap-8 p-4 boxnav">
          <li>
            <Link href="/property" className="menuitem">
              <strong>Imóvel</strong>
            </Link>
          </li>
          
          <li>
            <Link href="/transactions" className="menuitem">
              <strong>Transferências</strong>
            </Link>
          </li>
        

          <li>
            <Link href="/simulacao" className="menuitem">
             
            {/* "https://docs.google.com/spreadsheets/d/1zaFizrCN2Fwj7r9OQMH2imfdtOHAOS7OhnHM6yKw90M/edit?pli=1&gid=0#gid=0" */}
              <strong>Simulação</strong>
            </Link>
          </li>

          <li>
            <Link href="/pagamento" className="menuitem">
              <strong>Pagamento</strong>
            </Link>
          </li>  

          <li>
            <Link href="/documento" className="menuitem">
              <strong>Documentos</strong>
            </Link>
          </li>  
          
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
