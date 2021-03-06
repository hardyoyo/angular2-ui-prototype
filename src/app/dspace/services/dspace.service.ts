import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { HttpService } from '../../utilities/services/http.service';
import { Community } from '../models/community.model';
import { Collection } from '../models/collection.model';
import { Item } from '../models/item.model';
import { URLHelper } from "../../utilities/url.helper";

/**
 * Injectable service to provide an interface with the DSpace REST API 
 * through the utility http service. The responses here are returned as
 * Observables and the content is mapped to a JSON object.
 *
 * It important to note that the methods in this service are referenced
 * with bracket notation combining fetch with a constant.
 * Such as: dspaceService['fetch' + dspaceKeys[type].METHOD]
 *
 * TODO: map the JSON content to an inheritence model
 */
@Injectable()
export class DSpaceService {

    /**
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {}

    /**
     * Method to fetch top communities for navigation purposes.
     */
    fetchTopCommunities(): Observable<Array<Community>> {
        //TODO: handle top community pagination
        var params = new URLSearchParams();
        params.append("limit", '200');
        params.append("offset", '0');
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/top-communities'),
            search: params
        }).map(json => {
            let topCommunities = new Array<Community>();
            for(let communityJson of json) {
                topCommunities.push(new Community(communityJson));
            }
            return topCommunities;
        });
    }

    /**
     * Method to fetch subcommunities for navigation purposes.
     *
     * @param communityId
     *      The community id of which its subcommunities are to be fetched.
     */
    fetchCommunities(community): Observable<Array<Community>> {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + community.id + '/communities'),
            search: params
        }).map(json => {
            let communities = new Array<Community>();
            for(let communityJson of json) {
                communities.push(new Community(communityJson));
            }
            return communities;
        });
    }

    /**
     * Method to fetch collections of a community for navigation purposes.
     *
     * @param communityId
     *      The community id of which its collections are to be fetched.
     */
    fetchCollections(community): Observable<Array<Collection>> {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + community.id + '/collections'),
            search: params
        }).map(json => {
            let collections = new Array<Collection>();
            for(let collectionJson of json) {
                collections.push(new Collection(collectionJson));
            }
            return collections;
        });
    }

    /**
     * Method to fetch items of a collection for navigation purposes. 
     *
     * @param collectionId
     *      The collection id of which its items are to be fetched.
     */
    fetchItems(collection): Observable<Array<Item>> {
        var params = new URLSearchParams();
        params.append("limit", collection.limit);
        params.append("offset", collection.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/collections/' + collection.id + '/items?expand=metadata,bitstreams'),
            search: params
        }).map(json => {
            let items = new Array<Item>();
            for(let itemJson of json) {
                items.push(new Item(itemJson));
            }
            return items;
        });
    }

    /**
     * Method to fetch details of a community. 
     *
     * @param id
     *      Community id of which to fetch its relationships and other details.
     */
    fetchCommunity(id): Observable<Community> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + id + '?expand=parentCommunity,logo')
        }).map(json => {
            return new Community(json);
        });
    }

    /**
     * Method to fetch details of a collection. 
     *
     * @param id
     *      Collection id of which to fetch its relationships and other details.
     */
    fetchCollection(id): Observable<Collection> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/collections/' + id + '?expand=parentCommunity,logo')
        }).map(json => {
            return new Collection(json);
        });
    }

    /**
     * Method to fetch details of an item. 
     *
     * @param id
     *      Item id of which to fetch its relationships and other details.
     */
    fetchItem(id): Observable<Item> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/items/' + id + '?expand=metadata,bitstreams,parentCollection')
        }).map(json => {
            return new Item(json);
        });
    }

    /**
     * Method to login and recieve a token. 
     *
     * @param email
     *      DSpace user email/login
     * @param password
     *      DSpace user password
     */
    login(email, password): Observable<Response> {
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL('/login'),
            data: {
                'email': email,
                'password': password
            }
        });
    }

    /**
     * Method to get user status. 
     *
     * @param token
     *      DSpace user token
     */
    status(token): Observable<Response> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/status'),
            headers: [{
                key: 'rest-dspace-token', value: token
            }]
        });
    }

    /**
     * Method to logout. 
     *
     * @param token
     *      DSpace user token
     */
    logout(token: string): Observable<Response> {
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL('/logout'),
            headers: [{
                key: 'rest-dspace-token', value: token
            }]
        });
    }

    /**
     * Method to create community.
     *
     * @param community
     *      Community being created
     * @param token
     *      DSpace user token
     * @param parentCommunityId
     *      DSpace parent community id
     */
    createCommunity(community: Community, token: string, parentCommunityId?: string): Observable<Response> {
        let path = parentCommunityId ? '/communities/' + parentCommunityId + '/communities' : '/communities';
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL(path),
            headers: [{
                key: 'rest-dspace-token', value: token
            }],
            data: community
        });
    }

    /**
     * Method to create collection.
     *
     * @param collection
     *      Collection being created
     * @param token
     *      DSpace user token
     * @param parentCommunityId
     *      DSpace parent community id
     */
    createCollection(collection: Collection, token: string, parentCommunityId: string): Observable<Response> {
        let path = '/communities/' + parentCommunityId + '/collections';
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL(path),
            headers: [{
                key: 'rest-dspace-token', value: token
            }],
            data: collection
        });
    }

    /**
     * Method to create item.
     *
     * @param item
     *      Item being created
     * @param token
     *      DSpace user token
     * @param parentCollectionId
     *      DSpace parent collection id
     */
    createItem(item: Item, token: string, parentCollectionId: string): Observable<Response> {
        let path = '/collections/' + parentCollectionId + '/items';
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL(path),
            headers: [{
                key: 'rest-dspace-token', value: token
            }],
            data: item
        });
    }

    /**
     * Method to add bitstream to existing item.
     *
     * @param item
     *      Item in which to add bitstream
     * @param file
     *      Augmented file with description property added
     * @param token
     *      DSpace user token
     */
    addBitstream(item: Item, file: any, token: string): any {
        file.description = file.description ? file.description : file.name;
        let path = '/items/' + item.id + '/bitstreams?name=' + file.name + '&description=' + file.description;
        return this.httpService.upload({
            url: URLHelper.relativeToAbsoluteRESTURL(path),
            headers: [
                { key: 'Content-Type', value: file.type },
                { key: 'Accept', value: 'application/json' },
                { key: 'rest-dspace-token', value: token }
            ]
        }, file, token);
    }

}
