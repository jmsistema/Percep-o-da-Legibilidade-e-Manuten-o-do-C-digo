export default class Graph {
  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = isDirected;
  }

  /**
   * Adiciona um vértice ao grafo.
   * @param {GraphVertex} vertex
   */
  addVertex(vertex) {
    this.vertices[vertex.getKey()] = vertex;
  }

  /**
   * Retorna um vértice pelo seu identificador.
   * @param {string} key
   * @returns {GraphVertex|null}
   */
  getVertexByKey(key) {
    return this.vertices[key] || null;
  }

  /**
   * Retorna todos os vértices do grafo.
   * @returns {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * Retorna todas as arestas do grafo.
   * @returns {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges);
  }

  /**
   * Adiciona uma aresta ao grafo.
   * @param {GraphEdge} edge
   * @throws {Error}
   */
  addEdge(edge) {
    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before');
    }

    this.edges[edge.getKey()] = edge;
    this._ensureVertexExists(edge.startVertex);
    this._ensureVertexExists(edge.endVertex);
    this._connectVertices(edge);
  }

  /**
   * Remove uma aresta do grafo.
   * @param {GraphEdge} edge
   * @throws {Error}
   */
  deleteEdge(edge) {
    if (!this.edges[edge.getKey()]) {
      throw new Error('Edge not found in graph');
    }

    delete this.edges[edge.getKey()];
    edge.startVertex.deleteEdge(edge);
    edge.endVertex.deleteEdge(edge);
  }

  /**
   * Encontra uma aresta entre dois vértices.
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @returns {GraphEdge|null}
   */
  findEdge(startVertex, endVertex) {
    return startVertex?.findEdge(endVertex) || null;
  }

  /**
   * Obtém o peso total do grafo.
   * @returns {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((total, edge) => total + edge.weight, 0);
  }

  /**
   * Inverte todas as arestas do grafo direcionado.
   */
  reverse() {
    const edges = [...this.getAllEdges()];
    edges.forEach((edge) => {
      this.deleteEdge(edge);
      edge.reverse();
      this.addEdge(edge);
    });
  }

  /**
   * Retorna os índices dos vértices.
   * @returns {Object}
   */
  getVerticesIndices() {
    return this.getAllVertices().reduce((acc, vertex, index) => {
      acc[vertex.getKey()] = index;
      return acc;
    }, {});
  }

  /**
   * Retorna a matriz de adjacência.
   * @returns {number[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const indices = this.getVerticesIndices();
    const size = vertices.length;

    const matrix = Array.from({ length: size }, () => Array(size).fill(Infinity));

    vertices.forEach((vertex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const weight = this.findEdge(vertex, neighbor)?.weight ?? Infinity;
        matrix[indices[vertex.getKey()]][indices[neighbor.getKey()]] = weight;
      });
    });

    return matrix;
  }

  /**
   * Converte o grafo para string.
   * @returns {string}
   */
  toString() {
    return Object.keys(this.vertices).join(', ');
  }

  /**
   * Garante que o vértice existe no grafo.
   * @param {GraphVertex} vertex
   */
  _ensureVertexExists(vertex) {
    if (!this.getVertexByKey(vertex.getKey())) {
      this.addVertex(vertex);
    }
  }

  /**
   * Conecta dois vértices com uma aresta.
   * @param {GraphEdge} edge
   */
  _connectVertices(edge) {
    edge.startVertex.addEdge(edge);
    if (!this.isDirected) {
      edge.endVertex.addEdge(edge);
    }
  }
}
