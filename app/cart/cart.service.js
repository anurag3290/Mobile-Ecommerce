(function () {
    'use strict';

    angular
        .module('main')
        .service('CartService', function ($http, 
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY) {
            var that = this;
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            
            that.addToCart = function (item) {
                var deferred = $q.defer();

                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                if (!(item._id in cart)) {
                    cart[item._id] = item._id;

                    $cookieStore.put('cart', cart);

                    deferred.resolve('Added to cart');
                } else {
                    deferred.reject('Error: Can\'t added to cart');
                }

                return deferred.promise;
            };

            that.getCart = function () {
                var deferred = $q.defer();
                var cart = $cookieStore.get('cart');

                if (cart) {
                    deferred.resolve(cart);
                } else {
                    deferred.reject('Error: Can\'t get cart');
                }

                return deferred.promise;
            };

            that.removeFromCart = function (_id) {
                var deferred = $q.defer();

                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                if (_id in cart) {
                    delete cart[_id];

                    $cookieStore.put('cart', cart);

                    deferred.resolve('Removed from cart');
                } else {
                    deferred.reject('Error: Can\'t remove from cart');
                }

                return deferred.promise;
            };

            that.hasInCart = function (_id) {
                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                return _id in cart;
            };

            that.completeOrder = function (order) {
                var watches = [];

                order.watches.forEach(function (item) {
                    watches.push(item._id);
                });

                return $http.post(URL + BUCKET_SLUG + '/add-object/', {
                    write_key: WRITE_KEY,
                    title: order.firstName + ' ' + order.lastName,
                    type_slug: "orders",
                    metafields: [
                        {
                            key: "category",
                            title: "Category",
                            type: "text",
                            value: null
                        },
                        {
                            key: "program",
                            title: "Program",
                            type: "text",
                            value: null
                        },
                        {
                            key: "duration",
                            title: "Duration",
                            type: "text",
                            value: null
                        },
                        {
                            key: "start_date",
                            title: "Start Date",
                            type: "text",
                            value: null
                        },
                        {
                            key: "time_commitment",
                            title: "Time Commitment",
                            type: "text",
                            value: null
                        },
                        {
                            key: "topics_covered",
                            title: "Topics Covered",
                            type: "text",
                            value: null
                        },
                        {
                            key: "Course_Fee",
                            title: "course_fee",
                            type: "text",
                            value: null
                        },
                        {
                            key: "images",
                            title: "Images",
                            type: "parent",
                            value: "",
                            children: [
                                {
                                    key: "image_1",
                                    title: "Image_1",
                                    type: "file"
                                },
                                {
                                    key: "image_2",
                                    title: "Image_2",
                                    type: "file"
                                },
                                {
                                    key: "image_3",
                                    title: "Image_3",
                                    type: "file"
                                }
                            ]
                        }
                    ]
                });
            };
        });  
})();  