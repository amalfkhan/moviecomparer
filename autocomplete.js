const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
  //autocomplete searchbar generator
  root.innerHTML = `
  <label for="input"><b>Search</b></label>
  <input class="input" type="text"/>
  <div class="dropdown">
    <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
    </div>
  </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  //user searchbar input actions
  const onInput = async (e) => {
  const items = await fetchData(e.target.value);
  if (items.length === 0) {
    dropdown.classList.remove('is-active');  
    return;
  }
  resultsWrapper.innerHTML='';
  dropdown.classList.add('is-active');

  for (let item of items) {
    const option = document.createElement('a');
    
    option.classList.add('dropdown-item');
    option.innerHTML = renderOption(item);
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = inputValue(item);
      onOptionSelect(item);
    });
    resultsWrapper.appendChild(option); 
  }
  };

  input.addEventListener('input', 
    debounce(onInput, 500)
  );

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active');
    }
  });
}