export default class Graph {
  /**
   * @param {boolean} isDirected - Define se o grafo é direcionado.
   */
  constructor(isDirected = false) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = isDirected;
  }

  /**
   * Adiciona um vértice ao grafo.
   * @param {GraphVertex} newVertex - O vértice a ser adicionado.
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex;
    return this;
  }

  /**
   * Obtém um vértice pelo seu identificador.
   * @param {string} vertexKey - A chave do vértice.
   * @returns {GraphVertex|null}
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey] || null;
  }

  /**
   * Retorna os vizinhos de um vértice.
   * @param {GraphVertex} vertex - O vértice para o qual se deseja encontrar os vizinhos.
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors();
  }

  /**
   * Retorna todos os vértices do grafo.
   * @return {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * Retorna todas as arestas do grafo.
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges);
  }

  /**
   * Adiciona uma aresta ao grafo.
   * @param {GraphEdge} edge - A aresta a ser adicionada.
   * @returns {Graph}
   * @throws {Error} Se a aresta já foi adicionada anteriormente.
   */
  addEdge(edge) {
    // Verifica se os vértices da aresta já existem no grafo.
    let startVertex = this.getVertexByKey(edge.startVertex.getKey());
    let endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insere o vértice inicial caso ainda não esteja no grafo.
    if (!startVertex) {
      this.addVertex(edge.startVertex);
      startVertex = this.getVertexByKey(edge.startVertex.getKey());
    }

    // Insere o vértice final caso ainda não esteja no grafo.
    if (!endVertex) {
      this.addVertex(edge.endVertex);
      endVertex = this.getVertexByKey(edge.endVertex.getKey());
    }

    // Verifica se a aresta já foi adicionada.
    if (this.edges[edge.getKey()]) {
      throw new Error('Aresta já foi adicionada anteriormente');
    } else {
      this.edges[edge.getKey()] = edge;
    }

    // Adiciona a aresta aos vértices.
    if (this.isDirected) {
      // Se o grafo for direcionado, adiciona a aresta apenas ao vértice de origem.
      startVertex.addEdge(edge);
    } else {
      // Se o grafo não for direcionado, adiciona a aresta em ambos os vértices.
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);
    }

    return this;
  }

  /**
   * Remove uma aresta do grafo.
   * @param {GraphEdge} edge - A aresta a ser removida.
   * @throws {Error} Se a aresta não for encontrada no grafo.
   */
  deleteEdge(edge) {
    // Remove a aresta da lista de arestas.
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()];
    } else {
      throw new Error('Aresta não encontrada no grafo');
    }

    // Obtém os vértices da aresta e remove a aresta deles.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
  }

  /**
   * Encontra uma aresta entre dois vértices.
   * @param {GraphVertex} startVertex - Vértice de origem.
   * @param {GraphVertex} endVertex - Vértice de destino.
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex, endVertex) {
    const vertex = this.getVertexByKey(startVertex.getKey());

    if (!vertex) {
      return null;
    }

    return vertex.findEdge(endVertex);
  }

  /**
   * Retorna o peso total do grafo.
   * @return {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight;
    }, 0);
  }

  /**
   * Inverte todas as arestas do grafo direcionado.
   * @return {Graph}
   */
  reverse() {
    /** @param {GraphEdge} edge */
    this.getAllEdges().forEach((edge) => {
      // Remove a aresta original do grafo e dos vértices.
      this.deleteEdge(edge);

      // Inverte a direção da aresta.
      edge.reverse();

      // Adiciona a aresta invertida de volta ao grafo e aos vértices.
      this.addEdge(edge);
    });

    return this;
  }

  /**
   * Retorna os índices dos vértices no grafo.
   * @return {object}
   */
  getVerticesIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * Retorna a matriz de adjacência do grafo.
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Inicializa a matriz com valores de infinito, indicando que não há caminho entre os vértices.
    const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
      return Array(vertices.length).fill(Infinity);
    });

    // Preenche a matriz com os pesos das arestas.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];
        adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
      });
    });

    return adjacencyMatrix;
  }

  /**
   * Converte o grafo para uma string representando os vértices.
   * @return {string}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
