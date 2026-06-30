import Contact from './Contact'

function List({ contacts, displayConvo }) {
  return (
    <div>
      {contacts.map(name => (
        <Contact key={name} name={name} displayConvo={displayConvo}/>
      ))}
    </div>
  );
}

export default List