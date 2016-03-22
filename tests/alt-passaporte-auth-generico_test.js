"use strict";

describe('alt.passaporte-auth-generico', function() {
     var _windowMock;
     var _locationMock;
     var _httpMock;
     var _scope;

     var CHAVE_USUARIO;
     var CHAVE_INFORMACOES;
     var CHAVE_ID_PRODUTO;
     var PaginaUsuarioLogado;
     var PASSAPORTE_API_AUTHORIZATION_BASE;

     var LeitorUrl;
     var UsuarioInfo;
     var PassaporteService;
     var _info;
     var _idProduto;

     beforeEach(module('alt.passaporte-auth-generico', function($provide, PaginaUsuarioLogadoProvider) {
          _info = "YWxlc3NhbmRyYW1hY3Vsb0BnbWFpbC5jb206Pz8-Pz8-Pz8";
          _idProduto = "123456789";

          PaginaUsuarioLogadoProvider.url = '/abc';

          $provide.constant('$location', {
                   search: function() {
                        return {
                          info: _info,
                          idProduto: _idProduto
                        }
                   }
              });

          $provide.constant('$window', {
                   alert: angular.noop,
                   location: {
                        href: '',
                        assign: angular.noop,
                        replace: angular.noop
                   },
                   navigator: {userAgent: ''},
                   document: [{
                             createElement: function () {
                                  return null;
                             }
                        }
                   ],
                   localStorage: {
                     setItem: jasmine.createSpy(),
                     clear: jasmine.createSpy()
                   },
                   sessionStorage: {
                     setItem: jasmine.createSpy(),
                     clear: jasmine.createSpy()
                   }
              });
     }));

     beforeEach(inject(function($injector) {
          _windowMock = $injector.get('$window');
          _locationMock = $injector.get('$location');
          _httpMock = $injector.get('$httpBackend');
          _scope = $injector.get('$rootScope').$new();

          CHAVE_USUARIO = $injector.get('CHAVE_USUARIO');
          CHAVE_INFORMACOES = $injector.get('CHAVE_INFORMACOES');
          CHAVE_ID_PRODUTO = $injector.get('CHAVE_ID_PRODUTO');
          PaginaUsuarioLogado = $injector.get('PaginaUsuarioLogado');
          PASSAPORTE_API_AUTHORIZATION_BASE = $injector.get('PASSAPORTE_API_AUTHORIZATION_BASE');

          LeitorUrl = $injector.get('LeitorUrl');
          UsuarioInfo = $injector.get('UsuarioInfo');
          PassaporteService = $injector.get('PassaporteService');
        }))

     describe('CHAVE_USUARIO', function() {
          it('deve ter o valor correto na constante', function() {
               expect(CHAVE_USUARIO).toEqual('pass_usuario_auth');
          })
     })

     describe('CHAVE_INFORMACOES', function() {
          it('deve ter o valor correto na constante', function() {
               expect(CHAVE_INFORMACOES).toEqual('info');
          })
     })

     describe('CHAVE_ID_PRODUTO', function() {
          it('deve ter o valor correto na constante', function() {
               expect(CHAVE_ID_PRODUTO).toEqual('idProduto');
          })
     })

     describe('PaginaUsuarioLogado', function() {
          it('deve ter o valor correto na constante', function() {
               expect(PaginaUsuarioLogado).toEqual('/abc');
          })
     })

     describe('PASSAPORTE_API_AUTHORIZATION_BASE', function() {
          it('deve ter o valor correto na constante', function() {
               var _url = 'https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization';

               expect(PASSAPORTE_API_AUTHORIZATION_BASE).toEqual(_url);
          });
     });

     describe('LeitorUrl', function() {
          it('deve retornar undefined - nada informado', function() {
               expect(LeitorUrl.getValorPor(null)).toBeUndefined();
          })

          it('deve retornar undefined - parâmetro incorreto', function() {
               expect(LeitorUrl.getValorPor('abc')).toBeUndefined();
          })

          it('deve retornar o parâmetro correto', function() {
               expect(LeitorUrl.getValorPor('info')).toEqual(_info);
          })
     })

     describe('UsuarioInfo', function() {
          describe('registraInformaçõesApenas', function() {
               it('NÃO deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - Passaporte retorna erro', function() {
                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);
                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(403);

                    UsuarioInfo.registraInformacoesApenas();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).not.toHaveBeenCalledWith('/abc');
                    expect(_windowMock.localStorage.setItem).not.toHaveBeenCalled();
               })

               it('deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - INFORMAÇÕES ABERTAS DO USUARIO', function() {
                    var _respostaServidor = {
                         Nome: 'Eric',
                         imagem: 'http://alguma-servidor.com/abc.jpg',
                         Perfil: 'Adm',
                         assinantes: [{Nome: 'A', CNPJ: '1234567891234'}]
                    }

                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);

                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(_respostaServidor);

                    UsuarioInfo.registraInformacoesApenas();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).not.toHaveBeenCalled();
                    expect(_windowMock.localStorage.setItem).toHaveBeenCalledWith('pass_usuario_auth', JSON.stringify(_respostaServidor));
               })

               it('deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - INFORMAÇÕES FECHADAS DO USUARIO', function() {
                    var _respostaServidor = {
                         Nome: 'Eric',
                         imagem: 'http://alguma-servidor.com/abc.jpg',
                         Perfil: 'Adm',
                         assinantes: [{Nome: 'A', CNPJ: '1234567891234'}]
                    }

                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);

                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(_respostaServidor);

                    UsuarioInfo.registraInformacoesApenas();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).not.toHaveBeenCalled();
                    expect(_windowMock.localStorage.setItem).toHaveBeenCalledWith('pass_usuario_auth', JSON.stringify(_respostaServidor));
               })
          })

          describe('registraInformações', function() {
               it('NÃO deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - Passaporte retorna erro', function() {
                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);
                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(403);

                    UsuarioInfo.registraInformacoesRedireciona();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).not.toHaveBeenCalledWith('/abc');
                    expect(_windowMock.localStorage.setItem).not.toHaveBeenCalled();
               })

               it('deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - INFORMAÇÕES ABERTAS DO USUARIO', function() {
                    var _respostaServidor = {
                         Nome: 'Eric',
                         imagem: 'http://alguma-servidor.com/abc.jpg',
                         Perfil: 'Adm',
                         assinantes: [{Nome: 'A', CNPJ: '1234567891234'}]
                    }

                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);

                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(_respostaServidor);

                    UsuarioInfo.registraInformacoesRedireciona();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).toHaveBeenCalledWith('/abc');
                    expect(_windowMock.localStorage.setItem).toHaveBeenCalledWith('pass_usuario_auth', JSON.stringify(_respostaServidor));
               })

               it('deve registrar as informações gerais do usuário (após ter ido buscar no passaporte) - INFORMAÇÕES FECHADAS DO USUARIO', function() {
                    var _respostaServidor = {
                         Nome: 'Eric',
                         imagem: 'http://alguma-servidor.com/abc.jpg',
                         Perfil: 'Adm',
                         assinantes: [{Nome: 'A', CNPJ: '1234567891234'}]
                    }

                    spyOn(_windowMock.location, 'replace').and.callFake(angular.noop);

                    _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(_respostaServidor);

                    UsuarioInfo.registraInformacoesRedireciona();

                    _httpMock.flush();

                    expect(_windowMock.location.replace).toHaveBeenCalledWith('/abc');
                    expect(_windowMock.localStorage.setItem).toHaveBeenCalledWith('pass_usuario_auth', JSON.stringify(_respostaServidor));
               })
          })
     })

     describe('AuthCtrl', function() {
          var NOME_CONTROLLER = 'AuthCtrl';

          beforeEach(function() {
               _httpMock.expectGET('https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization?token=' + _info + '&idProduto=' + _idProduto).respond(200);
          })

          it('deve chamar registraInformacoesRedireciona', inject(function($controller) {
               spyOn(UsuarioInfo, 'registraInformacoesRedireciona').and.callFake(angular.noop);

               $controller(NOME_CONTROLLER, {$scope: _scope});

               expect(UsuarioInfo.registraInformacoesRedireciona).toHaveBeenCalled();
          }))
     })
})
