import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;
  const cg = cy.get;
  const cgId = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    cy.visit('/');

    cg('body').contains('Brand');
    cg('body').contains('Wrist Watch');
  });

  context('Store > Shopping Cart', () => {
    const quantity = 10;

    beforeEach(() => {
      server.createList('product', quantity);

      cy.visit('/');
    });

    it('should not display shopping cart when page first loads', () => {
      cgId('shopping-cart').should('have.class', 'hidden');
    });

    it('should toggle shopping cart visibility when button is clicked', () => {
      cgId('toggle-button').as('toggleButton');
      cg('@toggleButton').click();
      cgId('shopping-cart').should('not.have.class', 'hidden');
      cg('@toggleButton').click({ force: true });
      cgId('shopping-cart').should('have.class', 'hidden');
    });

    it('should open shopping cart when a product is added', () => {
      cgId('product-card').first().find('button').click();
      cgId('shopping-cart').should('not.have.class', 'hidden');
    });

    it('should add 3 products to the cart', () => {
      cy.addToCart([1, 2, 3]);
      cgId('cart-item').should('have.length', 3);
    });

    it('should add 1 product to the cart', () => {
      cy.addToCart(6);
      cgId('cart-item').should('have.length', 1);
    });

    it('should add all products to the cart', () => {
      cy.addToCart('all');
      cgId('cart-item').should('have.length', quantity);
    });
  });

  context('Store > Product List', () => {
    it('should display "0 Products" when no products is returned', () => {
      cy.visit('/');
      cgId('product-card').should('have.length', 0);
      cg('body').contains('0 Products');
    });

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product');

      cy.visit('/');
      cgId('product-card').should('have.length', 1);
      cg('body').contains('1 Product');
    });

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10);

      cy.visit('/');
      cgId('product-card').should('have.length', 10);
      cg('body').contains('10 Products');
    });
  });

  context('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      cg('input[type="search')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('should return 1 product when "Watch Mi" is used as serch term', () => {
      server.create('product', {
        title: 'Watch Mi',
      });
      server.createList('product', 10);

      cy.visit('/');
      cg('input[type="search').type('Watch Mi');
      cgId('search-form').submit();
      cgId('product-card').should('have.length', 1);
      cg('body').contains('1 Product');
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('/');
      cg('input[type="search').type('Watch Mi');
      cgId('search-form').submit();
      cgId('product-card').should('have.length', 0);
      cg('body').contains('0 Products');
    });
  });
});
